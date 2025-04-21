import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { v4 as uuidv4 } from 'uuid';
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import DigitalAssetService from "../../../modules/digital-asset/service";
import { CreateDigitalAssetLicenseInput } from "../types/digital-asset-license.types";


export const createDigitalAssetLicenseStep = createStep(
    "create-digital-asset-license",
    async (input: CreateDigitalAssetLicenseInput, { container }) => {
        const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET)

        const crearteDigitalAssetsLicense = await digitalAssetService.createDigitalAssetLicenses({
            id: uuidv4(),
            digital_asset_id: input.digital_asset_id,
            customer_id: input.customer_id,
            order_item_id: input.order_item_id,
        })

        return new StepResponse(crearteDigitalAssetsLicense, crearteDigitalAssetsLicense.id)
    },
    async (licenseId: string, { container }) => {
        const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET)

        await digitalAssetService.deleteDigitalAssetLicenses([licenseId])
    }
)
