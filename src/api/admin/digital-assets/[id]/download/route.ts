import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules, ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import { DIGITAL_ASSET } from "../../../../../modules/digital-asset";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const { id } = req.params;

  if (!id) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "디지털 에셋 ID가 필요합니다");
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const {
      data: [digitalAsset],
    } = await query.graph({
      entity: DIGITAL_ASSET,
      fields: ["id", "name", "file_id", "file_url", "mime_type"],
      filters: { id },
    });

    if (!digitalAsset) {
      throw new MedusaError(MedusaError.Types.NOT_FOUND, "디지털 에셋을 찾을 수 없습니다");
    }

    // File Service를 사용하여 presigned URL 생성
    const fileService = req.scope.resolve(Modules.FILE);

    try {
      // 현재는 retrieveFile 메서드 사용
      // S3 연동 완료 후 provider의 getPresignedDownloadUrl 메서드로 교체 예정
      const fileRecord = await fileService.retrieveFile(digitalAsset.file_id);

      if (!fileRecord) {
        throw new MedusaError(MedusaError.Types.NOT_FOUND, "파일을 찾을 수 없습니다");
      }

      return res.status(200).json({
        download_url: fileRecord.url,
        filename: digitalAsset.name,
        mime_type: digitalAsset.mime_type,
      });
    } catch (fileError) {
      // File ID로 조회 실패 시 URL 직접 반환
      console.log("파일 조회 실패, 저장된 URL 반환:", fileError);

      return res.status(200).json({
        download_url: digitalAsset.file_url,
        filename: digitalAsset.name,
        mime_type: digitalAsset.mime_type,
      });
    }
  } catch (error) {
    console.error("디지털 에셋 다운로드 오류:", error);
    return res.status(500).json({
      message: error.message || "다운로드 URL 생성 중 오류가 발생했습니다",
    });
  }
}
