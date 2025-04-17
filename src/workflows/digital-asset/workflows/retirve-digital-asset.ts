import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import retrieveDigitalAssetStep from "../steps/retirve-digital-asset"

const retrieveDigitalAssetWorkFlow = createWorkflow(
  "retrieve-digital-asset",
  (id:string) => {
    const digitalAsset = retrieveDigitalAssetStep(id)

    return new WorkflowResponse({
      digitalAsset,
    })
  }
)

export default retrieveDigitalAssetWorkFlow
