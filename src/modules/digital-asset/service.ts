import { MedusaService } from "@medusajs/framework/utils";
import DigitalAsset from "./models/digital-asset";
import DigitalAssetLicense from "./models/digital-asset-license";

export default class DigitalAssetService extends MedusaService({
  DigitalAsset,
  DigitalAssetLicense
}) {
  
}
