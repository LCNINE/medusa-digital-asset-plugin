import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { DIGITAL_ASSET } from "../../../../modules/digital-asset";

export async function POST(
  req: MedusaRequest<{ digital_asset_id: string; variant_id: string }>,
  res: MedusaResponse,
) {
  const { digital_asset_id, variant_id } = req.body;

  if (!digital_asset_id || !variant_id) {
    return res.status(400).json({
      message: "digital_asset_id와 variant_id가 필요합니다",
    });
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const {
      data: [digitalAsset],
    } = await query.graph({
      entity: DIGITAL_ASSET,
      fields: [
        "id",
        "name",
        "file_url",
        "thumbnail_url",
        "mime_type",
        "created_at",
        "updated_at",
        "deleted_at",
      ],
      filters: {
        id: digital_asset_id,
      },
    });

    if (!digitalAsset) {
      return res.status(404).json({
        message: "해당 디지털 자산이 존재하지 않습니다",
      });
    }

    const link = req.scope.resolve(ContainerRegistrationKeys.LINK);

    await link.create({
      [Modules.PRODUCT]: { variant_id },
      [DIGITAL_ASSET]: { digital_asset_id },
    });

    return res.status(200).json({
      message: "digital asset linked to variant",
    });
  } catch (error) {
    console.error("디지털 자산 연결 오류:", error);
    return res.status(500).json({
      message: error.message || "디지털 자산 연결 중 오류가 발생했습니다",
      code: error.type || "unknown_error",
    });
  }
}

export async function DELETE(
  req: MedusaRequest<{ digital_asset_id: string; variant_id: string }>,
  res: MedusaResponse,
) {
  const { digital_asset_id, variant_id } = req.body;

  if (!digital_asset_id || !variant_id) {
    return res.status(400).json({
      message: "digital_asset_id와 variant_id가 필요합니다",
    });
  }

  try {
    const link = req.scope.resolve(ContainerRegistrationKeys.LINK);

    await link.delete({
      [Modules.PRODUCT]: { variant_id },
      [DIGITAL_ASSET]: { digital_asset_id },
    });

    return res.status(200).json({
      message: "디지털 자산 연결이 해제되었습니다",
    });
  } catch (error) {
    console.error("디지털 자산 연결 해제 오류:", error);

    return res.status(500).json({
      message: "디지털 자산 연결 해제 중 오류가 발생했습니다",
      error: (error as Error).message,
    });
  }
}
