import { model } from "@medusajs/framework/utils";
import DigitalAssetLicense from "./digital-asset-license";


const DigitalAsset = model.define("digital_asset", {
  id: model.id().primaryKey(),
  name: model.text(),
  mime_type: model.text(),
  file_url: model.text(),
  thumbnail_url: model.text().nullable(),
  licenses: model.hasMany(() => DigitalAssetLicense, {
    mappedBy: "digital_asset_id", 
  }),
})

export default DigitalAsset;