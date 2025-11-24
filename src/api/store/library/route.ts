import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";

interface DigitalAsset {
  id: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  product_variants?: any[];
}

interface DigitalAssetLicense {
  id: string;
  customer_id: string;
  order_item_id: string | null | undefined;
  is_exercised: boolean;
  digital_asset?: {
    id: string;
    name: string;
    mime_type: string;
    file_url: string;
    thumbnail_url: string | null;
  };
}

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const limit = parseInt(req.query.limit as string) || 20;
  const offset = parseInt(req.query.offset as string) || 0;
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const customerId = req.auth_context.actor_id;
    const isExercised = req.query.is_exercised as string | undefined;

    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { data: licenses, metadata: { count, skip, take } = {} } = await query.graph({
      entity: "digital_asset_license",
      fields: [
        "id",
        "digital_asset_id",
        "customer_id",
        "order_item_id",
        "is_exercised",
        "digital_asset.*",
      ],
      filters: {
        customer_id: customerId,
        is_exercised: isExercised === "true" ? true : isExercised === "false" ? false : undefined,
      },
      pagination: {
        skip: offset,
        take: limit,
      },
    });

    // order_item_id만 추출
    const orderItemIds = licenses.map((l) => l.order_item_id).filter(Boolean);

    console.log("📦 [DEBUG] orderItemIds:", JSON.stringify(orderItemIds, null, 2));

    // order_item 정보 한 번에 조회
    const { data: orderItems } = await query.graph({
      entity: "order_item",
      fields: ["id", "created_at", "updated_at"],
      filters: { id: orderItemIds as string[] },
    });

    console.log("📦 [DEBUG] orderItems:", JSON.stringify(orderItems, null, 2));

    // order_item 정보를 id로 매핑
    const orderItemMap = {};
    orderItems.forEach((item) => {
      orderItemMap[item.id] = item;
    });

    console.log("📦 [DEBUG] orderItemMap:", JSON.stringify(orderItemMap, null, 2));

    // 라이센스 정보 정제
    const sanitizedLicenses = licenses.map((license: DigitalAssetLicense) => {
      if (!license.is_exercised && license.digital_asset) {
        return {
          ...license,
          digital_asset: {
            ...license.digital_asset,
            file_url: null,
          },
          order_item: license.order_item_id ? orderItemMap[license.order_item_id] : null,
        };
      }

      return license;
    });

    console.log("📦 [DEBUG] sanitizedLicenses:", JSON.stringify(sanitizedLicenses, null, 2));

    return res.status(200).json({
      licenses: sanitizedLicenses,
      count: count || 0,
      skip: skip || offset,
      take: take || limit,
    });
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
}
