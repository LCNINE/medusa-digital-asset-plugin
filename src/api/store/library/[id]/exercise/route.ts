import { AuthenticatedMedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils";
import DigitalAssetService from "../../../../../modules/digital-asset/service";

interface DigitalAsset {
  id: string;
  name: string;
  mime_type: string;
  file_url: string;
  thumbnail_url: string | null;
}

export async function POST(req: AuthenticatedMedusaRequest, res: MedusaResponse) {
  const licenseId = req.params.id;
  const customerId = req.auth_context.actor_id;

  if (!customerId) {
    throw new MedusaError(MedusaError.Types.UNAUTHORIZED, "로그인이 필요합니다.");
  }

  try {
    const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

    // 이 라이센스가 현재 로그인된 고객의 것인지 확인
    const {
      data: [license],
    } = await query.graph({
      entity: "digital_asset_license",
      filters: { id: licenseId, customer_id: customerId },
      fields: ["id", "is_exercised"],
    });

    if (!license) {
      throw new MedusaError(
        MedusaError.Types.NOT_FOUND,
        "라이센스를 찾을 수 없거나 접근 권한이 없습니다.",
      );
    }
    if (license.is_exercised) {
      throw new MedusaError(MedusaError.Types.INVALID_DATA, "이미 행사된 라이센스입니다.");
    }

    const digitalAssetService: DigitalAssetService = req.scope.resolve("digital_asset");

    // is_exercised true로 라이센스 행사권 행사, 이제 환불 안됌
    const updatedLicense = await digitalAssetService.updateDigitalAssetLicenses({
      id: licenseId,
      is_exercised: true,
    });

    const {
      data: [digital_asset],
    } = await query.graph({
      entity: "digital_asset",
      filters: { id: updatedLicense.digital_asset.id },
      fields: ["*"],
    });

    res.status(200).json({
      success: true,
      license_id: updatedLicense.id,
      message: "라이센스가 성공적으로 행사되었습니다.",
    });
  } catch (error) {
    console.error("error::", error);
    if (error instanceof MedusaError) {
      res.status(400).json({ message: error.message });
    } else {
      res.status(500).json({ message: "서버 내부 오류가 발생했습니다." });
    }
  }
}
