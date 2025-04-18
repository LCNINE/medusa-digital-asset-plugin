import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/utils";
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import { createDigitalAssetsWorkFlow } from "../../../workflows/digital-asset/workflows/create-digital-asset";
import { updateDigitalAssetWorkflow } from "../../../workflows/digital-asset/workflows/upload-digital-asset";
import { CreateDigitalAssetType, UpdateDigitalAssetType } from "./validators";

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY);

  try {
    const digitalAssetQuery = {
      entity: DIGITAL_ASSET,
      fields: ["*"],
    };

    const { data: digitalAssets } = await query.graph(digitalAssetQuery);

    return res.status(200).json({ digitalAssets });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
}

export async function POST(req: MedusaRequest<CreateDigitalAssetType>, res: MedusaResponse) {
  const input = req.validatedBody

  const {result} = await createDigitalAssetsWorkFlow(req.scope).run({input})
    
  res.status(200).json({ digital_asset: result })
}

export async function PATCH(req: MedusaRequest<UpdateDigitalAssetType>, res: MedusaResponse) {
  const input = req.validatedBody
    
  const {result} = await updateDigitalAssetWorkflow(req.scope).run({input})

  res.status(200).json({ digital_asset: result })
}
