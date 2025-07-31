import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { DIGITAL_ASSET } from "../modules/digital-asset";
import DigitalAssetService from "../modules/digital-asset/service";

export default async function orderCanceledRevokeLicense({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const orderService = container.resolve("orderService");
  const digitalAssetService = container.resolve<DigitalAssetService>(DIGITAL_ASSET);
  const logger = container.resolve("logger");
  const query = container.resolve(ContainerRegistrationKeys.QUERY);

  try {
    //  취소된 주문 조회
    const order = await (orderService as any).retrieveOrder(data.id, {
      relations: [
        "items",
        "items.variant",
        "items.variant.product_variants",
        "items.variant.product_variants.digital_assets",
      ],
    });

    for (const item of order.items) {
      // 이 주문 아이템에 연결된 모든 라이선스 조회
      const { data: licenses } = await query.graph({
        entity: "digital_asset_license",
        fields: ["id", "is_exercised"],
        filters: {
          order_item_id: item.id,
          customer_id: order.customer_id,
        },
      });

      //  행사되지 않은(is_exercised=false) 라이선스만 철회
      for (const license of licenses) {
        // 이미 행사된 라이선스는 철회하지 않음 (이미 권리 행사했으므로)
        if (!license.is_exercised) {
          await digitalAssetService.deleteDigitalAssetLicenses(license.id);

          logger.info(`라이선스 철회 완료: ${license.id}, 주문 ID: ${order.id}`);
        }
      }
    }

    logger.info(`주문 취소에 따른 디지털 자산 라이선스 철회 처리 완료, 주문 ID: ${order.id}`);
  } catch (err) {
    logger.error("디지털 자산 라이선스 철회 실패", err);
  }
}

export const config: SubscriberConfig = {
  event: "order.canceled",
};
