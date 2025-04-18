import { MedusaRequest, MedusaResponse } from "@medusajs/framework/http";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
// 디지털 에셋, 라이선스 고객이 조회

export async function GET(
  req: MedusaRequest,
  res: MedusaResponse
) {
  const customerId = req.query.customer_id
  const digitalAssetId = req.query.digital_asset_id

  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)

  let digitalAssets = []
  let licenses = []

  if (customerId) {
    //고객이 구매한 디지털에섯
  } else if (digitalAssetId) {
    // 그 디지털에셋과 관련된 라이선스
  } else {
    // 모든 디지털 에셋
  }

  res.status(200).json({
    digitalAssets,
    licenses
  })

}


