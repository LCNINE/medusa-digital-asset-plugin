import { defineLink } from "@medusajs/framework/utils";
import DigitalAssetModule from "../modules/digital-asset";
import ProductModule from "@medusajs/medusa/product";

export default defineLink(
  {
    linkable: DigitalAssetModule.linkable.digitalAsset,
    isList: true,
    customName: "digitalAssets",
  },
  {
    linkable: ProductModule.linkable.productVariant,
    isList: true,
    customName: "productVariants",
  },
  {
    database: {
      table: "digital_asset_product_variant",
    },
  },
);
