import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { CreateDigitalAssetInput } from "../../../workflows/digital-asset/steps/create-digital-asset";
import { UploadDigitalAssetInput } from "../../../workflows/digital-asset/steps/upload-digital-asset";
import { createDigitalAssetsWorkFlow } from "../../../workflows/digital-asset/workflows/create-digital-asset";
import retrieveDigitalAssetWorkFlow from "../../../workflows/digital-asset/workflows/retirve-digital-asset";
import { updateDigitalAssetWorkflow } from "../../../workflows/digital-asset/workflows/upload-digital-asset";
type CreateDigitalAssetBody = UploadDigitalAssetInput & CreateDigitalAssetInput

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  // 디지털 에셋 상세 조회 (파일 상세 조회)
  const { result } = await retrieveDigitalAssetWorkFlow(req.scope).run({
    input: req.params.id,
  })

  res.status(200).json({ digital_asset: result })
}

export async function POST(req: MedusaRequest<CreateDigitalAssetBody>, res: MedusaResponse) {
  const input = req.body

  // 디지털 에셋 생성
  const {result} =await createDigitalAssetsWorkFlow(req.scope).run({input})
    
  res.status(200).json({ digital_asset: result })
}

export async function PATCH(req: MedusaRequest<CreateDigitalAssetBody>, res: MedusaResponse) {
  const input = req.body
    
  const {result} =await updateDigitalAssetWorkflow(req.scope).run({input})

  res.status(200).json({ digital_asset: result })
}
