import { createWorkflow, WorkflowResponse } from "@medusajs/framework/workflows-sdk";
import { DigitalAssetInputBody } from "../../../types/digital-asset-input-body";
import { createDigitalAssetStep } from "../steps/create-digital-asset";
import { uploadDigitalAssetStep, uploadThumbnailAssetStep } from "../steps/upload-digital-asset";

export const createDigitalAssetsWorkFlow = createWorkflow(
  "create-digital-assets",
  (input: DigitalAssetInputBody) => {
    const uploadedAsset = uploadDigitalAssetStep({
      type: "digital-asset",
      base64Content: input.asset.base64Content,
      mimeType: input.asset.mimeType,
    });

    let uploadedThumbnail: ReturnType<typeof uploadThumbnailAssetStep> | undefined;
    if (input.thumbnail) {
      uploadedThumbnail = uploadThumbnailAssetStep({
        type: "digital-asset-thumbnail",
        base64Content: input.thumbnail.base64Content,
        mimeType: input.thumbnail.mimeType,
      });
    }

    const createdAsset = createDigitalAssetStep({
      name: input.name,
      fileId: uploadedAsset.id,
      mimeType: input.asset.mimeType,
      file_url: uploadedAsset.url,
      thumbnail_url: uploadedThumbnail?.url,
    });

    return new WorkflowResponse({
      createdAsset,
    });
  },
);
