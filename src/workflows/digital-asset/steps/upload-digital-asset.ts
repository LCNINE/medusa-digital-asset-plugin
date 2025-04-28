import { Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { v4 as uuidv4 } from "uuid";
import { DigitalAssetInputBody } from "../../../types/digital-asset-input-body";

export type UploadDigitalAssetInput = {
  type: "digital-asset" | "digital-asset-thumbnail";
  mimeType: string;
  base64Content: string;
};

export type UpdateDigitalAssetInput = {
  fileId: string;
  type: "digital-asset" | "digital-asset-thumbnail";
  mimeType: string;
  base64Content: string;
};

export const uploadDigitalAssetStep = createStep(
  "upload-digital-asset",
  async (input: UploadDigitalAssetInput, { container }) => {
    const fileModuleService = container.resolve(Modules.FILE);
    const fileId = uuidv4();

    const uploadedFiles = await fileModuleService.createFiles([
      {
        filename: `${input.type}/${fileId}`,
        mimeType: input.mimeType,
        content: input.base64Content,
      },
    ]);

    const uploadedFile = uploadedFiles[0];
    return new StepResponse(uploadedFile);
  },
  async (uploadedFile, { container }) => {
    if (!uploadedFile) return;

    const fileModuleService = container.resolve(Modules.FILE);
    await fileModuleService.deleteFiles([uploadedFile.id]);
  },
);

export const uploadThumbnailAssetStep = createStep(
  "upload-thumbnail-asset",
  async (input: UploadDigitalAssetInput, { container }) => {
    const fileModuleService = container.resolve(Modules.FILE);
    const fileId = uuidv4();

    const uploadedFiles = await fileModuleService.createFiles([
      {
        filename: `${input.type}/${fileId}`,
        mimeType: input.mimeType,
        content: input.base64Content,
      },
    ]);

    const uploadedFile = uploadedFiles[0];
    return new StepResponse(uploadedFile);
  },
  async (uploadedFile, { container }) => {
    if (!uploadedFile) return;

    const fileModuleService = container.resolve(Modules.FILE);
    await fileModuleService.deleteFiles([uploadedFile.id]);
  },
);

export const updateDigitalAssetStep = createStep(
  "update-digital-asset",
  async (input: UpdateDigitalAssetInput, { container }) => {
    const fileModuleService = container.resolve(Modules.FILE);

    const tempFileId = uuidv4();
    const tempFileName = `${input.type}/${tempFileId}`;

    const uploadedFiles = await fileModuleService.createFiles([
      {
        filename: tempFileName,
        mimeType: input.mimeType,
        content: input.base64Content,
      },
    ]);

    const newFile = uploadedFiles[0];

    if (!newFile) {
      throw new Error("Failed to create the new file");
    }

    try {
      // 새 파일 생성 성공 후 기존 파일 삭제
      await fileModuleService.deleteFiles([input.fileId]);

      return new StepResponse(newFile);
    } catch (error) {
      // 기존 파일 삭제 실패 시 새로 만든 파일 삭제
      await fileModuleService.deleteFiles([newFile.id]);
      throw error;
    }
  },
  async (updatedFile, { container }) => {
    if (!updatedFile) return;

    const fileModuleService = container.resolve(Modules.FILE);
    await fileModuleService.deleteFiles([updatedFile.id]);
  },
);
