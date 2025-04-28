import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils";
import multer from "multer";
import { DIGITAL_ASSET } from "../../../../modules/digital-asset";
import DigitalAssetService from "../../../../modules/digital-asset/service";
import { UpdateDigitalAssetInput } from "../../../../workflows/digital-asset/steps/upload-digital-asset";
import { updateDigitalAssetWorkflow } from "../../../../workflows/digital-asset/workflows/upload-digital-asset";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const digitalAssetId = req.params.id;
  if (!digitalAssetId) return MedusaError.Types.INVALID_DATA;

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const digitalAssetQuery = {
      entity: DIGITAL_ASSET,
      filters: {
        id: digitalAssetId,
      },
      fields: ["*"],
    };

    const {
      data: [digitalAsset],
    } = await query.graph(digitalAssetQuery);

    return res.status(200).json({ digitalAsset });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

const upload = multer({ storage: multer.memoryStorage() }).fields([
  { name: "file", maxCount: 1 },
  { name: "thumbnail", maxCount: 1 },
]);

export async function PATCH(req: MedusaRequest<{ name: string }>, res: MedusaResponse) {
  await new Promise<void>((resolve, reject) => {
    upload(req as any, res as any, (err) => {
      if (err) {
        return reject(new MedusaError(MedusaError.Types.INVALID_DATA, "파일 업로드 실패"));
      }
      resolve();
    });
  });

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

    const updateData: any = {};

    if (name) {
      updateData.name = name;
    }

    let updatedFile;

    const files = req.files as { [fieldname: string]: Express.Multer.File[] };
    const file = files?.file?.[0];

    if (files && file) {
      const input: UpdateDigitalAssetInput = {
        fileId: existingAsset.file_id,
        type: "digital-asset",
        mimeType: file.mimetype,
        base64Content: file.buffer.toString("base64"),
      };

      const { result } = await updateDigitalAssetWorkflow(req.scope).run({ input });
      updatedFile = result.updatedFile;

      updateData.file_id = updatedFile.id;
      updateData.file_url = updatedFile.url;
      updateData.mime_type = file.mimetype;
    }

    if (Object.keys(updateData).length === 0) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "업데이트할 내용이 없습니다");
    }

    const digitalAssetService = req.scope.resolve(DIGITAL_ASSET);
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

  const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);
  await digitalAssetService.softDeleteDigitalAssets([digitalAssetId]);

  return res.status(200).json({ message: "digitalAsse deleted" });
}
