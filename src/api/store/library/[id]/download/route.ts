import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import { Readable } from "stream";

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const licenseId = req.params.id;
  const customerId = req.auth_context.actor_id;

  if (!customerId) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "로그인이 필요합니다.");
  }

  try {
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

    const s3Client = new S3Client({
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });

    // S3 버킷과 키 추출
    const url = new URL(license.digital_asset.file_url);
    const bucket = url.hostname.split(".")[0];
    const key = decodeURIComponent(url.pathname.substring(1));

    const command = new GetObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    const s3Object = await s3Client.send(command);

    if (!s3Object.Body) {
      throw new Error("파일 내용을 가져올 수 없습니다.");
    }

    res.setHeader("Content-Type", s3Object.ContentType || "application/octet-stream");

    const filename = encodeURIComponent(license.digital_asset.name);
    res.setHeader("Content-Disposition", `attachment; filename="${filename}"`);

    // 파일 스트리밍
    if (s3Object.Body instanceof Readable) {
      return s3Object.Body.pipe(res);
    } else {
      const stream = Readable.from(await s3Object.Body.transformToByteArray());
      return stream.pipe(res);
    }
  } catch (error) {
    console.error("파일 다운로드 에러:", error);
    if (error instanceof MedusaError) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: "파일 다운로드 중 오류가 발생했습니다." });
  }
}
