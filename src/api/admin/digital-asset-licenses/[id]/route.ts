import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils";
import { DIGITAL_ASSET } from "../../../../modules/digital-asset";
import DigitalAssetService from "../../../../modules/digital-asset/service";

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const licenseId = req.params.id;
  const includeDeleted = req.query.include_deleted === "true";

  if (!licenseId) return MedusaError.Types.INVALID_DATA;

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  let filters: any = includeDeleted ? { deleted_at: { $ne: null } } : { deleted_at: null };

  try {
    const { data } = await query.graph({
      entity: "digital_asset_license",
      fields: ["customer.*", "digital_asset.*"],
      filters: {
        id: licenseId,
        ...filters,
      },
    });

    let digitalAssetLicense = data[0];

    const {
      data: [customer],
    } = await query.graph({
      entity: "customer",
      fields: ["id", "first_name", "last_name", "email"],
      filters: {
        id: digitalAssetLicense.customer_id,
      },
    });

    digitalAssetLicense.customer = customer;

    return res.status(200).json(digitalAssetLicense);
  } catch (error) {
    console.error("디지털 자산 라이센스 조회 오류:", error);
    return res.status(500).json({
      message: error.message,
      error_code: "SERVER_ERROR",
    });
  }
}
