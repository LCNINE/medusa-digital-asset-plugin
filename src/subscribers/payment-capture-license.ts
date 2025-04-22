import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"
import { createDigitalAssetLicenseWorkFlow } from "../workflows/digital-asset-license/workflows/create-digital-asset-licenses"
import DigitalAssetService from "../modules/digital-asset/service"

export const config: SubscriberConfig = {
  event: "payment.captured",  // Medusa 코어가 emit 하는 이벤트 이름
}

export default async function paymentCapturedLicense(
  { event: { data }, container }: SubscriberArgs<{ id: string }>
) {
  const paymentService = container.resolve(Modules.PAYMENT)         // Payment Module 서비스 가져오기  
  const orderService   = container.resolve("orderService")  
  const digitalSvc     = container.resolve<DigitalAssetService>("digital_asset")  
  const logger         = container.resolve("logger")

  try {
    // 1) 결제 객체 조회 (payment.id → payment.order_id 포함)
    const payment = await (paymentService as any).retrievePayment(data.id)

    // 2) 주문 조회 (relations 로 items → variants → digital_assets 포함)  
    const order = await (orderService as any).retrieveOrder(payment.order_id, {
      relations: [
        "items",
        "items.variant", 
        "items.variant.product_variants",
        "items.variant.product_variants.digital_assets",
      ],
    })

    // 3) 라이선스 발급 워크플로우 실행  
    for (const item of order.items) {
      for (const pv of item.variant.product_variants) {
        for (const da of pv.digital_assets) {
          await createDigitalAssetLicenseWorkFlow(container).run({
            input: {
              digital_asset_id: da.id,
              order_item_id:    item.id,
              customer_id:      order.customer_id,
            },
          })
        }
      }
    }
  } catch (err) {
    logger.error("Digital asset license 생성 실패", err)
  }
}
