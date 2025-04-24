import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";

interface DigitalAsset {
  id: string;
  title: string;
  description?: string;
  metadata?: Record<string, unknown>;
  product_variants?: any[];
}

interface DigitalAssetLicense {
  id: string;
  digital_asset_id: string;
  customer_id: string;
  order_item_id?: string;
  is_exercised: boolean;
  digital_asset?: DigitalAsset;
  customer?: any;
}

export async function GET(
  req: AuthenticatedMedusaRequest,
  res: MedusaResponse
) {
  const limit = parseInt(req.query.limit as string) || 20
  const offset = parseInt(req.query.offset as string) || 0
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  try {
    const customerId = req.auth_context.actor_id

    if (!customerId) {
      return res.status(401).json({ message: "Unauthorized" })
    }

    const {
      data: licenses,
      metadata: { count, skip, take } = {},
    } = await query.graph({
      entity: "digital_asset_license",
      fields: [
        "id",
        "digital_asset_id",
        "customer_id",
        "order_item_id",
        "is_exercised",
        "digital_asset.*"
      ],
      filters: {
        customer_id: customerId, 
      },
      pagination: {
        skip: offset,
        take: limit,
      },
    })
    
    if (licenses.length > 0) {
      console.log("📦 [DEBUG] First license object:", JSON.stringify(licenses[0], null, 2))
    }

    const sanitizedLicenses = licenses.map((license: DigitalAssetLicense) => {
      if (!license.is_exercised && license.digital_asset) {
        return {
          ...license,
          digital_asset: {
            ...license.digital_asset,
            file_url: null,
          },
        }
      }

      return license
    })

    return res.status(200).json({
      licenses: sanitizedLicenses,
      pagination: {
        count: count || 0,
        skip: skip || offset,
        take: take || limit,
      }
    })
  } catch (error) {
    return res.status(400).json({ error: error.message })
  }
}
