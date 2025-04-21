import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { CreateDigitalAssetLicenseInput } from "../types/digital-asset-license.types"
import { createDigitalAssetLicenseStep } from "../steps/create-digital-asset-license"

export const createDigitalAssetLicenseWorkFlow = createWorkflow(
  "create-digital-asset-license",
  (input: CreateDigitalAssetLicenseInput) => {


    const createdAsset = createDigitalAssetLicenseStep({
      ...input,
    })

    return new WorkflowResponse({
      createdAsset,
    })
  }
)