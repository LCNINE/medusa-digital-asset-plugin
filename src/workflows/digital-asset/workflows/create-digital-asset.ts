import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk"
import { CreateDigitalAssetInput, createDigitalAssetStep } from "../steps/create-digital-asset"
import { UploadDigitalAssetInput, uploadDigitalAssetStep } from "../steps/upload-digital-asset"

type Input = UploadDigitalAssetInput & CreateDigitalAssetInput


export const createDigitalAssetsWorkFlow = createWorkflow(
    "create-digital-assets",
    (input: Input) => {
      const uploadedFile = uploadDigitalAssetStep(input)

      const createdAsset = createDigitalAssetStep({
        ...input,
        fileId: uploadedFile.id
      })
  
      return new WorkflowResponse({
        createdAsset,
      })
    }
  )