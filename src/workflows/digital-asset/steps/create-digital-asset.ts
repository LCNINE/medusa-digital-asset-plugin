import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import DigitalAssetService from "../../../modules/digital-asset/service";

export type CreateDigitalAssetInput = {
  name: string;
  fileId: string;
  mimeType: string;
  file_url: string;
  thumbnail_url?: string;
};

export const createDigitalAssetStep = createStep(
  "create-digital-asset",
  async (input: CreateDigitalAssetInput, { container }) => {
    const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET);

    const createdAsset = await digitalAssetService.createDigitalAssets({
      file_id: input.fileId,
      name: input.name,
      mime_type: input.mimeType,
      file_url: input.file_url,
      thumbnail_url: input.thumbnail_url,
    });

    return new StepResponse(createdAsset, createdAsset.id);
  },
  async (assetId: string, { container }) => {
    const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET);

    await digitalAssetService.deleteDigitalAssets([assetId]);
  },
);
