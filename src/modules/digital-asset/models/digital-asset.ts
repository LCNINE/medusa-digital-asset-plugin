import { model } from "@medusajs/framework/utils";
import DigitalAssetLicense from "./digital-asset-license";
import ProductVariantDigitalAsset from "./product_variant_digital_asset";

const DigitalAsset = model.define("digital_asset", {
  id: model.id().primaryKey(),
  name: model.text(),
  mime_type: model.text(),
  file_url: model.text(),
  thumbnail_url: model.text().nullable(),
  licenses: model.hasMany(() => DigitalAssetLicense),
  product_variants: model.hasMany(() => ProductVariantDigitalAsset),
})

export default DigitalAsset;