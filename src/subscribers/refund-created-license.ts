import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import DigitalAssetService from "../modules/digital-asset/service";
import { DIGITAL_ASSET } from "../modules/digital-asset";

type ReturnWithCreatedAt = {
  id: string;
  order_id: string;
  created_at: string;
  items: {
    item_id: string;
    quantity: number;
  }[];
};

export default async function handleRefundCreatedLicense({
  event: { data },
  container,
}: SubscriberArgs<{ id: string; order_id: string }>) {
  const orderService = container.resolve("orderService");
  const logger = container.resolve("logger");
  const query = container.resolve(ContainerRegistrationKeys.QUERY);
  const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET);

  try {
    // 환불에 관련된 반품(Return) 정보 조회 시도
    const { data: returnsData } = await query.graph({
      entity: "return",
      fields: ["id", "order_id", "created_at", "items.item_id", "items.quantity"],
      filters: {
        order_id: data.order_id,
      },
    });

    const returns = returnsData as unknown as ReturnWithCreatedAt[];

    // 환불된 주문 조회
    const order = await (orderService as any).retrieveOrder(data.order_id, {
      relations: [
        "items",
        "items.variant",
        "items.variant.product_variants",
        "items.variant.product_variants.digital_assets",
      ],
    });

    // 부분 환불인 경우 처리: 반품 정보가 있으면 해당 아이템만 처리
    if (returns && returns.length > 0) {
      // 가장 최신의 반품 정보 사용
      const latestReturn = returns.sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime(),
      )[0];

      // 반품된 아이템 ID 목록 추출
      const returnedItemIds = latestReturn.items.map((item) => item?.item_id);

      // 반품된 아이템만 처리
      for (const item of order.items) {
        if (returnedItemIds.includes(item.id)) {
          // 해당 주문 아이템에 연결된 모든 라이선스 조회
          const { data: licenses } = await query.graph({
            entity: "digital_asset_license",
            fields: ["id", "is_exercised"],
            filters: {
              order_item_id: item.id,
              customer_id: order.customer_id,
            },
          });

          // 행사되지 않은(is_exercised=false) 라이선스만 철회
          for (const license of licenses) {
            // 이미 행사된 라이선스는 철회하지 않음 (이미 권리 행사했으므로)
            if (!license.is_exercised) {
              await digitalAssetService.deleteDigitalAssetLicenses(license.id);
              logger.info(
                `환불로 인한 라이선스 철회 완료: ${license.id}, 주문 ID: ${order.id}, 아이템 ID: ${item.id}`,
              );
            }
          }
        }
      }
    } else {
      // 환불 정보에서 반품 정보를 찾을 수 없는 경우 모든 아이템 처리 (기존 로직)
      logger.info(
        `반품 정보를 찾을 수 없어 모든 아이템에 대해 철회 처리합니다. 주문 ID: ${order.id}`,
      );

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

        // 행사되지 않은(is_exercised=false) 라이선스만 철회
        for (const license of licenses) {
          // 이미 행사된 라이선스는 철회하지 않음 (이미 권리 행사했으므로)
          if (!license.is_exercised) {
            await digitalAssetService.deleteDigitalAssetLicenses(license.id);
            logger.info(`환불로 인한 라이선스 철회 완료: ${license.id}, 주문 ID: ${order.id}`);
          }
        }
      }
    }

    logger.info(
      `환불에 따른 디지털 자산 라이선스 철회 처리 완료, 주문 ID: ${order.id}, 환불 ID: ${data.id}`,
    );
  } catch (err) {
    logger.error("환불에 따른 디지털 자산 라이선스 철회 실패", err);
  }
}

export const config: SubscriberConfig = {
  event: "payment.refunded",
};
