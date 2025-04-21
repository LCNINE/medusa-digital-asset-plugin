import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { v4 as uuidv4 } from 'uuid';
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import DigitalAssetService from "../../../modules/digital-asset/service";
import { CreateDigitalAssetLicenseInput, UpdateDigitalAssetLicenseInput } from "../types/digital-asset-license.types";


export const updateDigitalAssetLicenseStep = createStep(
    "update-digital-asset-license",
    async (input: UpdateDigitalAssetLicenseInput, { container }) => {
        const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET)

        const updatedLicense = await digitalAssetService.updateDigitalAssetLicenses({
            id: input.id,
            digital_asset_id: input.digital_asset_id,
            customer_id: input.customer_id,
            order_item_id: input.order_item_id,
            is_exercised: input.is_exercised,
        })

        return new StepResponse(updatedLicense, updatedLicense.id)
    },
    async (licenseId: string, { container }) => {
        const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET)

        await digitalAssetService.deleteDigitalAssetLicenses([licenseId])
    }
)
