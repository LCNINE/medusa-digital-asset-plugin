import { model } from "@medusajs/framework/utils";
import DigitalAsset from "./digital-asset";

const DigitalAssetLicense = model.define("digital_asset_license", {
  id: model.id().primaryKey(),
  digital_asset_id: model.belongsTo(() => DigitalAsset, {
    mapped: "licenses"
  }),
})

export default DigitalAssetLicense;