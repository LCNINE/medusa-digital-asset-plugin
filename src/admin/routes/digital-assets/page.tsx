import { defineRouteConfig } from "@medusajs/admin-sdk";
import { DigitalAssetProvider } from "./_context";
import DigitalAssetManager from "./_manager";

const DigitalAssetsPage = () => {
  return (
    <DigitalAssetProvider>
      <DigitalAssetManager />
    </DigitalAssetProvider>
  );
};

export default DigitalAssetsPage;

export const config = defineRouteConfig({
  label: "Digital asset",
});
