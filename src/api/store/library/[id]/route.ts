import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import DigitalAssetService from "../../../../modules/digital-asset/service";
import zod from "zod";

interface DigitalAsset {
    id: string;
    name: string;
    mime_type: string;
    file_url: string;
    thumbnail_url: string | null;
}

interface DigitalAssetLicense {
    id: string;
    digital_asset_id: string;
    customer_id: string;
    order_item_id: string;
    is_exercised: boolean;
}

export async function GET(req: MedusaRequest, res: MedusaResponse) {
    const licenseId = req.params.fileId

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
    const digitalAssetService: DigitalAssetService = req.scope.resolve("digital_asset")

    // 라이센스 조회
    const result = await query.graph({
        entity: "digital_asset_license",
        filters: { id: licenseId },
        fields: ["*"]
    })
    
    const license = result.data[0] as any
    if (!license) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "License not found")
    }

    // 디지털 자산 조회
    const assetResult = await query.graph({
        entity: "digital_asset",
        filters: { id: license.digital_asset_id },
        fields: ["*"]
    })
    
    const digital_asset = assetResult.data[0] as any

    // 디지털에셋의 is_exercised에 따라서 fileURL 보여줌
    res.status(200).json({
        license: {
            ...license,
            digital_asset: {
                ...digital_asset,
                file_url: license.is_exercised ? digital_asset.file_url : null,
            }
        },
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