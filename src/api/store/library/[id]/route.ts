import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import DigitalAssetService from "../../../../modules/digital-asset/service";

interface DigitalAsset {
  id: string;
  name: string;
  mime_type: string;
  file_url: string;
  thumbnail_url: string | null;
}

export async function GET(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  try {
    const licenseId = req.params.id;
    const customerId = req.auth_context.actor_id;

    if (!customerId) {
      throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "로그인이 필요합니다.");
    }

    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);
    const digitalAssetService: DigitalAssetService = req.scope.resolve("digital_asset");

    // 라이센스 조회
    const {
      data: [license],
    } = await query.graph({
      entity: "digital_asset_license",
      filters: { id: licenseId, customer_id: customerId },
      fields: ["*"],
    });

    // 디지털 자산 조회
    const {
      data: [digital_asset],
    } = await query.graph({
      entity: "digital_asset",
      filters: { id: license.digital_asset.id },
      fields: ["*"],
    });

    // 디지털에셋의 is_exercised에 따라서 fileURL 보여줌
    res.status(200).json({
      license: {
        ...license,
        digital_asset: {
          ...digital_asset,
          file_url: license.is_exercised ? digital_asset.file_url : null,
        },
      },
    });
  } catch (error) {
    throw new MedusaError(MedusaError.Types.INVALID_DATA, "Invalid data");
  }
}
