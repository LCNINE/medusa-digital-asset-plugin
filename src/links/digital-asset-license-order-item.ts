import { defineLink } from "@medusajs/framework/utils";
import OrderModule from "@medusajs/medusa/order";
import DigitalAssetModule from "../modules/digital-asset";

export default defineLink(
  {
    linkable: DigitalAssetModule.linkable.digitalAssetLicense,
    isList: true,
  },
  OrderModule.linkable.orderLineItem, 
)