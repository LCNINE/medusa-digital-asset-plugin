import { CreateDigitalAssetLicenseType } from "../../../api/admin/digital-asset-licenses/validators";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { v4 as uuidv4 } from "uuid";
import { DIGITAL_ASSET } from "../../../modules/digital-asset";
import DigitalAssetService from "../../../modules/digital-asset/service";

export const createDigitalAssetLicenseStep = createStep(
  "create-digital-asset-license",
  async (input: CreateDigitalAssetLicenseType, { container }) => {
    const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET);

    const crearteDigitalAssetsLicense = await digitalAssetService.createDigitalAssetLicenses({
      id: uuidv4(),
      digital_asset_id: input.digital_asset_id,
      customer_id: input.customer_id,
      order_item_id: input.order_item_id || null,
    });

    return new StepResponse(crearteDigitalAssetsLicense, crearteDigitalAssetsLicense.id);
  },
  async (licenseId: string, { container }) => {
    const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET);

    await digitalAssetService.deleteDigitalAssetLicenses([licenseId]);
  },
);

// import { CreateDigitalAssetLicenseType } from "../../../api/admin/digital-asset-licenses/validators";
// import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
// import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils";
// import { v4 as uuidv4 } from "uuid";
// import { DIGITAL_ASSET } from "../../../modules/digital-asset";
// import DigitalAssetService from "../../../modules/digital-asset/service";

// export const createDigitalAssetLicenseStep = createStep(
//   "create-digital-asset-license",
//   async (input: CreateDigitalAssetLicenseType, { container }) => {
//     const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET);
// const link = container.resolve(ContainerRegistrationKeys.LINK);

//     const crearteDigitalAssetsLicense = await digitalAssetService.createDigitalAssetLicenses({
//       id: uuidv4(),
//       digital_asset_id: input.digital_asset_id,
//       customer_id: input.customer_id,
//       order_item_id: input.order_item_id || null,
//     });

//     const licenseId = crearteDigitalAssetsLicense.id;

//     // License <-> Customer 링크 생성
//     await link.create({
//       [DIGITAL_ASSET]: { digital_asset_license_id: licenseId },
//       [Modules.CUSTOMER]: { customer_id: input.customer_id },
//     });

//     // License <-> Order Item 링크 생성 (order_item_id가 있는 경우)
//     if (input.order_item_id) {
//       await link.create({
//         [DIGITAL_ASSET]: { digital_asset_license_id: licenseId },
//         [Modules.ORDER]: { order_line_item_id: input.order_item_id },
//       });
//     }

//     // License <-> Order 링크 생성 (order_id가 있는 경우)
//     if (input.order_id) {
//       await link.create({
//         [DIGITAL_ASSET]: { digital_asset_license_id: licenseId },
//         [Modules.ORDER]: { order_id: input.order_id },
//       });
//     }

//     return new StepResponse(crearteDigitalAssetsLicense, licenseId);
//   },
//   async (licenseId: string, { container }) => {
//     const digitalAssetService: DigitalAssetService = container.resolve(DIGITAL_ASSET);
//     const link = container.resolve(ContainerRegistrationKeys.LINK);

//     // 링크 제거 (dismiss 대신 query로 찾아서 삭제)
//     const query = container.resolve(ContainerRegistrationKeys.QUERY);

//     // Customer 링크 제거
//     const { data: customerLinks } = await query.graph({
//       entity: "digital_asset_license_customer",
//       fields: ["id"],
//       filters: { digital_asset_license_id: licenseId },
//     });
//     if (customerLinks && customerLinks.length > 0) {
//       await link.dismiss(
//         customerLinks.map((l: any) => ({ id: l.id }))
//       );
//     }

//     // Order Item 링크 제거
//     const { data: orderItemLinks } = await query.graph({
//       entity: "digital_asset_license_order_item",
//       fields: ["id"],
//       filters: { digital_asset_license_id: licenseId },
//     });
//     if (orderItemLinks && orderItemLinks.length > 0) {
//       await link.dismiss(
//         orderItemLinks.map((l: any) => ({ id: l.id }))
//       );
//     }

//     // Order 링크 제거
//     const { data: orderLinks } = await query.graph({
//       entity: "digital_asset_license_order",
//       fields: ["id"],
//       filters: { digital_asset_license_id: licenseId },
//     });
//     if (orderLinks && orderLinks.length > 0) {
//       await link.dismiss(
//         orderLinks.map((l: any) => ({ id: l.id }))
//       );
//     }

//     // 라이센스 삭제
//     await digitalAssetService.deleteDigitalAssetLicenses([licenseId]);
//   },
// );
