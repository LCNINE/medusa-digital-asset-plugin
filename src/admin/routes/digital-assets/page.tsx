import { defineRouteConfig } from "@medusajs/admin-sdk";
import DigitalAssetManager from "./_manager";

const DigitalAssetsPage = () => {
  return <DigitalAssetManager />;
};

export default DigitalAssetsPage;

export const config = defineRouteConfig({
  label: "Digital asset",
});
