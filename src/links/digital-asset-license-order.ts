import { defineLink } from "@medusajs/framework/utils";
import DigitalAssetModule from "../modules/digital-asset";
import OrderModule from "@medusajs/medusa/order";

export default defineLink(
  {
    linkable: DigitalAssetModule.linkable.digitalAssetLicense,
    isList: true,
  },
  OrderModule.linkable.order,
)