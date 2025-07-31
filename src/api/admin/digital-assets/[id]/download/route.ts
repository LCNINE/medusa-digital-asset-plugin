import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { DIGITAL_ASSET } from "../../../../../modules/digital-asset";
import { GetObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { Readable } from "stream";
import { ContainerRegistrationKeys } from "@medusajs/utils";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const { id } = req.params;

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const {
      data: [digitalAsset],
    } = await query.graph({
      entity: DIGITAL_ASSET,
      fields: ["id", "name", "file_url", "mime_type"],
      filters: { id },
    });

    if (!digitalAsset) {
      return res.status(404).json({ message: "디지털 자산을 찾을 수 없습니다." });
    }

    const s3Client = new S3Client({
      region: process.env.S3_REGION!,
      credentials: {
        accessKeyId: process.env.S3_ACCESS_KEY_ID!,
        secretAccessKey: process.env.S3_SECRET_ACCESS_KEY!,
      },
    });

    // S3 버킷과 키 추출
    const url = new URL(digitalAsset.file_url);
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

    // Content-Type 설정
    res.setHeader("Content-Type", s3Object.ContentType || "application/octet-stream");

    // Content-Disposition 설정 (파일 이름 지정)
    const filename = encodeURIComponent(digitalAsset.name);
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
    return res.status(500).json({ message: "파일 다운로드 중 오류가 발생했습니다." });
  }
}
