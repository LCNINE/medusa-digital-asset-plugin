import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { v4 as uuidv4 } from 'uuid';

type UploadDigitalAssetInput = {
  type: "digital-asset" | "digital-asset-thumbnail"
  mimeType: string,
  base64Content: string
}

export const uploadDigitalAssetStep = createStep(
  "upload-digital-asset",
  async (input: UploadDigitalAssetInput, { container }) => {
    const fileModuleService = container.resolve(Modules.FILE)
    const fileId = uuidv4();

    const uploadedFiles = await fileModuleService.createFiles([
      {
        filename: `${input.type}/${fileId}`,
        mimeType: input.mimeType,
        content: input.base64Content
      }
    ])

    const uploadedFile = uploadedFiles[0]
    return new StepResponse(uploadedFile)
  },
  async (uploadedFile, { container }) => {
    if (!uploadedFile) return;

    const fileModuleService = container.resolve(Modules.FILE)
    await fileModuleService.deleteFiles([uploadedFile.id])
  }
)
