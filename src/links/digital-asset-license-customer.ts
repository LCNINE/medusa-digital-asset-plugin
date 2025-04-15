import { defineLink } from "@medusajs/framework/utils";
import DigitalAssetModule from "../modules/digital-asset";
import CustomerModule from "@medusajs/medusa/customer";

export default defineLink(
  {
    linkable: DigitalAssetModule.linkable.digitalAssetLicense,
    isList: true,
  },
  CustomerModule.linkable.customer,
)