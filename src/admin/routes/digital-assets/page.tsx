import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ArrowDownCircle } from "@medusajs/icons";
import DigitalAssetManager from "./_manager";

const DigitalAssetsPage = () => {
  return <DigitalAssetManager />;
};

export default DigitalAssetsPage;

export const config = defineRouteConfig({
  label: "Digital assets",
  icon: ArrowDownCircle,
});
