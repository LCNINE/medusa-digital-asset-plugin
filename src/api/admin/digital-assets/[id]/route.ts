import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/utils";
import { DIGITAL_ASSET } from '../../../../modules/digital-asset'
import DigitalAssetService from "../../../../modules/digital-asset/service";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const digitalAssetId = req.params.id;
  if (!digitalAssetId) return MedusaError.Types.INVALID_DATA;

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const digitalAssetQuery = {
      entity: DIGITAL_ASSET,
      filters: {
        id: digitalAssetId
      },
      fields: ["*"],
    };

    const { data: [drivers] } = await query.graph(digitalAssetQuery);

    return res.status(200).json({ drivers });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}



export async function DELETE(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const digitalAssetId = req.params.id;
  if (!digitalAssetId) return MedusaError.Types.INVALID_DATA;

  const digitalAssetService: DigitalAssetService = req.scope.resolve(DIGITAL_ASSET)
  await digitalAssetService.deleteDigitalAssets(digitalAssetId)

  return res.status(200).json({ message: "digitalAsse deleted" });
}