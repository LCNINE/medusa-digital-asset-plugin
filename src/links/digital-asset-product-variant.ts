import { defineLink } from "@medusajs/framework/utils";
import DigitalAssetModule from "../modules/digital-asset";
import ProductModule from "@medusajs/medusa/product";

export default defineLink(
  {
    linkable: DigitalAssetModule.linkable.digitalAsset,
    isList: true,
    customName: "digital_assets",
  },
  {
    linkable: ProductModule.linkable.productVariant,
    isList: true,
    customName: "product_variants",
  },
  {
    database: {
      table: "digital_asset_product_variant",
    },
  },
);
