import { model } from "@medusajs/framework/utils";
import ProductVariant from "@medusajs/medusa/product";
import DigitalAsset from "./digital-asset";

const ProductVariantDigitalAsset = model.define("product_variant_digital_asset", {
    id: model.id().primaryKey(),
  
    variant_id: model.belongsTo(() => ProductVariant, {
      mapped: "digital_assets", 
    }),
  
    digital_asset_id: model.belongsTo(() => DigitalAsset, {
      mapped: "product_variants", 
    }),
  })
  
  export default ProductVariantDigitalAsset
  