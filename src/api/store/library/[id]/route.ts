import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import DigitalAssetService from "../../../../modules/digital-asset/service";
import zod from "zod";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const licenseId = req.params.fileId

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

    const { data: [license] } = await query.graph({
        entity: "digital_asset_license",
        filters: { id: licenseId },
        fields: ["*", "digital_asset.*"]
    })

    if (!license) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "License not found")
    }

    res.status(200).json({
        license
    })
}

const schema = zod.object({
    is_exercised: zod.boolean()
})

/**
 * 라이선스 상태 업데이트
 * @param req.params.fileId 라이선스 id
 */
export async function PATCH(req: MedusaRequest, res: MedusaResponse) {
    const licenseId = req.params.fileId

    try {
        const { is_exercised } = schema.parse(req.body)

        const digitalAssetService: DigitalAssetService = req.scope.resolve("digital_asset")

        const updatedLicense = await digitalAssetService.updateDigitalAssetLicenses(licenseId, {
            is_exercised,
        })

        res.status(200).json({
            license: updatedLicense
        })
    } catch (error) {
        throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid data")
    }

}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
    // 라이선스 삭제
    const licenseId = req.params.fileId

    if (!licenseId) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "License not found")
    }

    const digitalAssetService: DigitalAssetService = req.scope.resolve("digital_asset")

    await digitalAssetService.deleteDigitalAssetLicenses(licenseId)

    res.status(200).json({
        message: "License deleted",
        licenseId
    })
}