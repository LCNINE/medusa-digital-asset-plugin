import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { UpdateDigitalAssetInput, updateDigitalAssetStep, uploadDigitalAssetStep } from "../steps/upload-digital-asset";

type UploadDigitalAssetInput = {
  type: "digital-asset" | "digital-asset-thumbnail"
  mimeType: string,
  base64Content: string
}

export const uploadDigitalAssetWorkflow = createWorkflow(
  "upload-digital-asset",
  (input: UploadDigitalAssetInput) => {
    const uploadedFile = uploadDigitalAssetStep(input)

    return new WorkflowResponse({
      uploadedFile,
    })
  }
)

export const updateDigitalAssetWorkflow = createWorkflow(
  "update-digital-asset",
  (input: UpdateDigitalAssetInput) => {
    const updatedFile = updateDigitalAssetStep(input)

    return new WorkflowResponse({
      updatedFile,
    })
  }
)


