import { DIGITAL_ASSET } from "@/modules/digital-asset";
import { SubscriberArgs, type SubscriberConfig } from "@medusajs/framework";
import { ContainerRegistrationKeys } from "@medusajs/framework/utils";
import { createDigitalAssetLicenseWorkFlow } from "../workflows/digital-asset-license/workflows/create-digital-asset-licenses";

export default async function handlePaymentCapturedLicense({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const logger = container.resolve("logger");

  try {
    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    const { data: payments } = await query.graph({
      entity: "payment",
      fields: [
        "id",
        "payment_collection.order.id",
        "payment_collection.order.customer_id",
        "payment_collection.order.items.id",
        "payment_collection.order.items.variant.id",
        "payment_collection.order.items.variant.digital_assets.*",
      ],
      filters: { id: data.id },
    });

    const payment = payments?.[0];
    const order = payment?.payment_collection?.order;

    if (!order?.id || !order?.customer_id || !order?.items) {
      logger.warn(
        `결제 완료 이벤트를 받았지만 주문 정보가 불완전합니다. paymentId: ${data.id}, orderId: ${order?.id}, hasCustomer: ${!!order?.customer_id}, hasItems: ${!!order?.items}`,
      );
      return;
    }

    const licenseCreationTasks: Promise<any>[] = [];

    for (const item of order.items) {
      if (!item?.variant) {
        continue;
      }

      const digitalAssets = (item.variant as any).digital_assets || [];

      for (const digitalAsset of digitalAssets) {
        if (!digitalAsset?.id) {
          continue;
        }

        licenseCreationTasks.push(
          createDigitalAssetLicenseWorkFlow(container).run({
            input: {
              digital_asset_id: digitalAsset.id,
              order_item_id: item.id,
              customer_id: order.customer_id as string,
            },
          }),
        );
      }
    }

    if (licenseCreationTasks.length > 0) {
      await Promise.all(licenseCreationTasks);
      logger.info(
        `${licenseCreationTasks.length}개의 디지털 자산 라이선스가 생성되었습니다. orderId: ${order.id}, customerId: ${order.customer_id}`,
      );
    } else {
      logger.info(
        `주문에 디지털 자산이 포함되어 있지 않아 라이선스를 생성하지 않았습니다. orderId: ${order.id}`,
      );
    }
  } catch (err) {
    logger.error("Digital asset license 생성 실패", err);
  }
}

export const config: SubscriberConfig = {
  event: "payment.captured",
};
