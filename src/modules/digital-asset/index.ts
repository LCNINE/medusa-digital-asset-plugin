import { Module } from "@medusajs/framework/utils"
import DigitalAssetService from "./service"

export const DIGITAL_ASSET = "digital_asset"

export default Module(DIGITAL_ASSET, {
  service: DigitalAssetService,
})