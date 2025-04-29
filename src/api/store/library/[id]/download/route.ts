import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { Modules, ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const licenseId = req.params.id;
  const customerId = req.auth_context.actor_id;

  if (!customerId) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "로그인이 필요합니다.");
  }

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
  const {
    data: [license],
  } = await query.graph({
    entity: "digital_asset_license",
    fields: ["id", "customer_id", "order_item_id", "is_exercised", "digital_asset.*"],
    filters: {
      id: licenseId,
      customer_id: customerId,
    },
  });

  if (!license) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "라이선스를 찾을 수 없습니다.");
  }

  if (!license.is_exercised) {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      "소유권 먼저 행사해야 다운로드 할 수 있습니다.",
    );
  }

  // FILE Module에서 Signed URL 임시 사용
  // AWS S3를 아직 연동하지 않아 presigned URL 기능을 바로 사용할 수 없습니다.
  // 그래서 지금은 fileService.retrieveFile()로 반환되는 fileRecord.url 을 내려주고,
  // 차후 AWS 연결 완료 후 getPresignedDownloadUrl() 으로 교체할 예정입니다.
  const fileService = req.scope.resolve(Modules.FILE);
  const fileUrl = license.digital_asset.file_url;

  let fileKey = fileUrl;
  try {
    // URL에서 파일명만 추출
    if (fileUrl.startsWith("http")) {
      const urlObj = new URL(fileUrl);
      fileKey = decodeURIComponent(urlObj.pathname.split("/").pop() || "");
    }
  } catch (error) {
    console.error("URL 파싱 에러:", error);
  }

  console.log("fileKey:::::", fileKey);
  const fileRecord = await fileService.retrieveFile(fileKey);

  if (!fileRecord) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "파일 URL 정보를 찾을 수 없습니다.");
  }

  //  지금방식은 로컬 파일 경로나 CDN 경로가 그대로 노출돼서
  // 추후 AWS S3 버킷 연결 완료 시 getPresignedDownloadUrl(fileKey) 호출로 변경
  res.status(200).json({ url: fileRecord });
}
