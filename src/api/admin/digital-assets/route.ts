import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/utils";
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import { CreateDigitalAssetInput } from "../../../workflows/digital-asset/steps/create-digital-asset";
import { UploadDigitalAssetInput } from "../../../workflows/digital-asset/steps/upload-digital-asset";
import { createDigitalAssetsWorkFlow } from "../../../workflows/digital-asset/workflows/create-digital-asset";
import { updateDigitalAssetWorkflow } from "../../../workflows/digital-asset/workflows/upload-digital-asset";


type CreateDigitalAssetBody = UploadDigitalAssetInput & CreateDigitalAssetInput

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

export async function POST(req: MedusaRequest<CreateDigitalAssetBody>, res: MedusaResponse) {
  const input = req.body

  const {result} =await createDigitalAssetsWorkFlow(req.scope).run({input})
    
  res.status(200).json({ digital_asset: result })
}

export async function PATCH(req: MedusaRequest<CreateDigitalAssetBody>, res: MedusaResponse) {
  const input = req.body
    
  const {result} =await updateDigitalAssetWorkflow(req.scope).run({input})

  res.status(200).json({ digital_asset: result })
}
