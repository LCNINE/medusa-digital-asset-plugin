import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import DigitalAssetService from "../../../modules/digital-asset/service";


export const deleteDigitalAssetLicenseStep = createStep(
    "delete-digital-asset-license",
    async (license_id: string, { container }) => {
        const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET)

        const deletedLicense = await digitalAssetService.deleteDigitalAssetLicenses([license_id])

        return new StepResponse(deletedLicense, license_id)
    },
    async (licenseId: string, { container }) => {
        const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET)

        await digitalAssetService.deleteDigitalAssetLicenses([licenseId])
    }
)
