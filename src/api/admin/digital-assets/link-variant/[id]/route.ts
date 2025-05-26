import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { DIGITAL_ASSET } from "../../../../../modules/digital-asset";
import { DigitalAsset, ProductVariant } from ".medusa/types/query-entry-points";

type ExtendedProductVariant = ProductVariant & {
  digital_assets: DigitalAsset[];
};

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  try {
    const { id } = req.params;

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    const result = await query.graph({
      entity: "product_variant",
      fields: ["digital_assets.*"],
      filters: {
        id,
      },
    });

    const variant = result.data[0] as ExtendedProductVariant;
    return res.status(200).json(variant.digital_assets);
  } catch (error) {
    return res.status(500).json({
      message: "디지털 자산 연결 조회 중 오류가 발생했습니다.",
      error: (error as Error).message,
    });
  }
}
