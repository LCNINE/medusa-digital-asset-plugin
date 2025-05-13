import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils";
import { DIGITAL_ASSET } from "../../../../modules/digital-asset";
import DigitalAssetService from "../../../../modules/digital-asset/service";
import { UpdateDigitalAssetInput } from "../../../../workflows/digital-asset/steps/upload-digital-asset";
import { updateDigitalAssetWorkflow } from "../../../../workflows/digital-asset/workflows/upload-digital-asset";
import { UpdateDigitalAssetType } from "../validators";
import { CreateFileDTO } from "@medusajs/framework/types";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const digitalAssetId = req.params.id;

  if (!digitalAssetId) return MedusaError.Types.INVALID_DATA;

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const {
      data: [digitalAsset],
    } = await query.graph({
      entity: DIGITAL_ASSET,
      fields: ["id", "name", "product_variants.*"],
      filters: {
        id: digitalAssetId,
      },
    });

    return res.status(200).json({ digitalAsset });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function PATCH(req: MedusaRequest<UpdateDigitalAssetType>, res: MedusaResponse) {
  const { name } = req.body;
  const { id } = req.params;

  if (!id) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "digital_asset_id가 필요합니다");
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const {
      data: [existingAsset],
    } = await query.graph({
      entity: DIGITAL_ASSET,
      fields: ["*"],
      filters: { id },
    });

    if (!existingAsset) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "디지털 에셋을 찾을 수 없습니다");
    }

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const file = files?.file?.[0];
    const thumbnail = files?.thumbnail?.[0];

    const uploadFiles: CreateFileDTO[] = [];

    if (file) {
      uploadFiles.push({
        filename: file.originalname,
        mimeType: file.mimetype,
        content: file.buffer.toString("binary"),
        access: "private" as const,
      });
    }

    if (thumbnail) {
      uploadFiles.push({
        filename: thumbnail.originalname,
        mimeType: thumbnail.mimetype,
        content: thumbnail.buffer.toString("binary"),
        access: "public" as const,
      });
    }

    const { result } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: uploadFiles.map((file) => ({
          ...file,
          access: file.access as "private" | "public",
        })),
      },
    });

    const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);

    const updateData: any = {};

    if (req.body.name) {
      updateData.name = req.body.name;
    }

    if (file) {
      const mainFileInfo = result[0];
      updateData.file_id = mainFileInfo.id;
      updateData.mime_type = file.mimetype;
      updateData.file_url = mainFileInfo.url;
    }

    if (thumbnail) {
      const thumbnailFileInfo = result[1];
      updateData.thumbnail_url = thumbnailFileInfo.url;
    }

    const updatedAsset = await digitalAssetService.updateDigitalAssets({ id, ...updateData });

    res.status(200).json({ digital_asset: updatedAsset });
  } catch (error) {
    console.error("디지털 에셋 업데이트 오류:", error);
    res.status(500).json({
      message: error.message || "디지털 에셋 업데이트 중 오류가 발생했습니다",
      code: error.type || "unknown_error",
    });
  }
}

export async function DELETE(req: MedusaRequest, res: MedusaResponse) {
  const digitalAssetId = req.params.id;
  if (!digitalAssetId) return MedusaError.Types.INVALID_DATA;

  try {
    const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);
    await digitalAssetService.softDeleteDigitalAssets([digitalAssetId]);

    const link = req.scope.resolve(ContainerRegistrationKeys.LINK);
    await link.delete({
      [DIGITAL_ASSET]: {
        digital_asset_id: digitalAssetId,
      },
    });

    return res.status(200).json({ message: "디지털 자산이 삭제되었습니다" });
  } catch (error) {
    console.error("디지털 자산 삭제 오류:", error);
    return res.status(500).json({
      message: error.message || "디지털 자산 삭제 중 오류가 발생했습니다",
      code: error.type || "unknown_error",
    });
  }
}
