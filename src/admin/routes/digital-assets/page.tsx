import { defineRouteConfig } from "@medusajs/admin-sdk";
import { ArrowDownCircle } from "@medusajs/icons";
import { TooltipProvider } from "@medusajs/ui";
import DigitalAssetManager from "./_manager";

const DigitalAssetsPage = () => {
  return (
    <TooltipProvider>
      <DigitalAssetManager />
    </TooltipProvider>
  );
};

export default DigitalAssetsPage;

export const config = defineRouteConfig({
  label: "Digital assets",
  icon: ArrowDownCircle,
});
