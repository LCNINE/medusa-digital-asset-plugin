import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { v4 as uuidv4 } from "uuid";
import { CreateDigitalAssetLicenseType } from "../../../api/admin/digital-asset-licenses/validators";
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import DigitalAssetService from "../../../modules/digital-asset/service";

export const createDigitalAssetLicenseStep = createStep(
  "create-digital-asset-license",
  async (input: CreateDigitalAssetLicenseType, { container }) => {
    const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET);
    const link = container.resolve(ContainerRegistrationKeys.LINK);

    const crearteDigitalAssetsLicense = await digitalAssetService.createDigitalAssetLicenses({
      id: uuidv4(),
      digital_asset_id: input.digital_asset_id,
      customer_id: input.customer_id,
      order_item_id: input.order_item_id || null,
    });

    const licenseId = crearteDigitalAssetsLicense.id;

    // License <-> Customer 링크 생성
    await link.create({
      [DIGITAL_ASSET]: { digital_asset_license_id: licenseId },
      [Modules.CUSTOMER]: { customer_id: input.customer_id },
    });

    // License <-> Order Item 링크 생성
    if (input.order_item_id) {
      await link.create({
        [DIGITAL_ASSET]: { digital_asset_license_id: licenseId },
        [Modules.ORDER]: { order_line_item_id: input.order_item_id },
      });
      await link.create({
        [DIGITAL_ASSET]: { digital_asset_license_id: licenseId },
        [Modules.ORDER]: { order_item_id: input.order_item_id },
      });
    }

    return new StepResponse(crearteDigitalAssetsLicense, crearteDigitalAssetsLicense.id);
  },
  async (licenseId: string, { container }) => {
    const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET);
    const link = container.resolve(ContainerRegistrationKeys.LINK);

    const query = container.resolve(ContainerRegistrationKeys.QUERY);

    // Customer 링크 제거
    const { data: customerLinks } = await query.graph({
      entity: "digital_asset_license_customer",
      fields: ["id"],
      filters: { digital_asset_license_id: licenseId },
    });

    if (customerLinks && customerLinks.length > 0) {
      await link.dismiss(customerLinks.map((l: any) => ({ id: l.id })));
    }

    // Order Item 링크 제거
    const { data: orderItemLinks } = await query.graph({
      entity: "digital_asset_license_order_item",
      fields: ["id"],
      filters: { digital_asset_license_id: licenseId },
    });
    if (orderItemLinks && orderItemLinks.length > 0) {
      await link.dismiss(orderItemLinks.map((l: any) => ({ id: l.id })));
    }

    // Order 링크 제거
    const { data: orderLinks } = await query.graph({
      entity: "digital_asset_license_order",
      fields: ["id"],
      filters: { digital_asset_license_id: licenseId },
    });
    if (orderLinks && orderLinks.length > 0) {
      await link.dismiss(orderLinks.map((l: any) => ({ id: l.id })));
    }

    await digitalAssetService.deleteDigitalAssetLicenses([licenseId]);
  },
);
