import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { RestoreDigitalAssetType } from "../validators";
import { DIGITAL_ASSET } from "../../../../modules/digital-asset";
import DigitalAssetService from "../../../../modules/digital-asset/service";

export async function POST(req: MedusaRequest<RestoreDigitalAssetType>, res: MedusaResponse) {
  const { ids } = req.body;

  if (!ids) {
    return res.status(400).json({
      message: "ids is required",
    });
  }

  const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET);

  const restoredAssets = await digitalAssetService.restoreDigitalAssets(ids);

  return res.status(200).json({
    message: "restoredAssets",
    data: restoredAssets,
  });
}
