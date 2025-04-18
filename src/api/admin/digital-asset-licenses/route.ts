import { MedusaRequest } from "@medusajs/framework/http"
import { MedusaResponse } from "@medusajs/framework/http";

export async function GET(req: MedusaRequest, res: MedusaResponse){
    const digitalAssetId = req.query.digital_asset_id
    const customerId = req.query.customer_id
    
    if (digitalAssetId || customerId) {
        // 특정 디지털 에셋이나 고객 기준 필터링 기능
        // TODO: 필터 조건에 따른 라이센스 검색 로직 작성
        // const licenses = await getLicensesByFilter(digitalAssetId, customerId)
        // res.status(200).json({ licenses })
    } else {
        // 모든 라이센스 목록 조회
        // const licenses = await getAllLicenses()
        // res.status(200).json({ licenses })
    }
}

export async function POST(req: MedusaRequest, res: MedusaResponse){
  // 새 라이센스 생성
}

export async function PATCH(req: MedusaRequest, res: MedusaResponse){
  // 라이센스 정보 업데이트 (특히 is_exercised 상태)

}

export async function DELETE(req: MedusaRequest, res: MedusaResponse){
 // 라이센스 삭제
}
