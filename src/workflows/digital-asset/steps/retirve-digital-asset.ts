import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk"
import { DIGITAL_ASSET } from "../../../modules/digital-asset"
import DigitalAssetService from "../../../modules/digital-asset/service"
import { container } from "@medusajs/framework"



const retrieveDigitalAssetStep = createStep(
  "retrieve-digital-asset",
  async (id: string, { container }) => {
    const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET)
    const digitalAsset = await digitalAssetService.retrieveDigitalAsset(id)

    return new StepResponse(digitalAsset, id)
  }
)

export default retrieveDigitalAssetStep
