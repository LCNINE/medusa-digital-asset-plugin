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

    const orderItemIds = licenses
      .map((license: DigitalAssetLicense) => license.order_item_id)
      .filter((id): id is string => Boolean(id));

    const { data: orderItems } = await query.graph({
      entity: "order_item",
      fields: ["id", "created_at", "updated_at", "quantity"],
      filters: {
        item_id: {
          $in: orderItemIds,
        },
      },
    });

    console.log("DEBUG: orderItems:", orderItems);

    // order_item_id를 키로 하는 맵 생성
    const orderItemMap = new Map(orderItems.map((item: any) => [item.id, item]));

    // 라이센스 정보 정제
    const sanitizedLicenses = licenses.map((license: DigitalAssetLicense) => {
      const orderItem = license.order_item_id ? orderItemMap.get(license.order_item_id) : null;
      console.log("DEBUG: license:", license);
      console.log("DEBUG: orderItem:", orderItem);
      if (!license.is_exercised && license.digital_asset) {
        return {
          ...license,
          digital_asset: {
            ...license.digital_asset,
            file_url: null,
          },
          orderedAt: orderItem?.created_at || null,
        };
      }

      return {
        ...license,
        orderedAt: orderItem?.created_at || null,
      };
    });

    console.log("DEBUG: sanitizedLicenses:", sanitizedLicenses);

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
