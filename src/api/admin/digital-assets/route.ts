import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CreateFileDTO } from "@medusajs/framework/types";
import { uploadFilesWorkflow } from "@medusajs/medusa/core-flows";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils";
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import DigitalAssetService from "../../../modules/digital-asset/service";
import { CreateDigitalAssetType } from "./validators";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    // includeDeleted가 true면 삭제된 항목을 포함해 모든 데이터 조회
    const includeDeleted = req.query.include_deleted === "true";

    const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);

    const digital_assets = await digitalAssetService.listDigitalAssets(
      {},
      {
        withDeleted: includeDeleted,
      },
    );

    return res.status(200).json({ digital_assets });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function POST(req: MedusaRequest<CreateDigitalAssetType>, res: MedusaResponse) {
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };
  const file = files?.file?.[0];
  const thumbnail = files?.thumbnail?.[0];

  if (!file) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "No file was uploaded");
  }

  const uploadFiles: CreateFileDTO[] = [];

  uploadFiles.push({
    filename: file.originalname,
    mimeType: file.mimetype,
    content: file.buffer.toString("binary"),
    access: "private" as const,
  });

  if (thumbnail) {
    uploadFiles.push({
      filename: thumbnail.originalname,
      mimeType: thumbnail.mimetype,
      content: thumbnail.buffer.toString("binary"),
      access: "public" as const,
    });
  }

  try {
    const { result } = await uploadFilesWorkflow(req.scope).run({
      input: {
        files: uploadFiles.map((file) => ({
          ...file,
          access: file.access as "private" | "public",
        })),
      },
    });
    const mainFileInfo = result[0];
    const thumbnailFileInfo = thumbnail ? result[1] : undefined;
    const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);
    const digitalAsset = await digitalAssetService.createDigitalAssets({
      name: req.body.name,
      file_id: mainFileInfo.id,
      mime_type: file.mimetype,
      file_url: mainFileInfo.url,
      thumbnail_url: thumbnailFileInfo?.url,
    });
    res.status(200).json({
      digital_asset: digitalAsset,
    });
  } catch (error) {
    console.error("디지털 자산 업로드 오류:", error);
    res.status(500).json({
      message: error.message || "파일 업로드 중 오류가 발생했습니다",
      code: error.type || "unknown_error",
    });
  }
}
