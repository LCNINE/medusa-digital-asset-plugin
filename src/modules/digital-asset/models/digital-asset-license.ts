import { model } from "@medusajs/framework/utils";
import DigitalAsset from "./digital-asset";

const DigitalAssetLicense = model.define("digital_asset_license", {
  id: model.id().primaryKey(),
  digital_asset_id: model.belongsTo(() => DigitalAsset, {
    mapped: "licenses",
    cascade: ["delete"]
  }),
  customer_id: model.text(),
  order_item_id: model.text(),
  is_exercised: model.boolean().default(false),
})

export default DigitalAssetLicense