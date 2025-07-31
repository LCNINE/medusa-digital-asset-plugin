import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Key, Spinner } from "@medusajs/icons";
import { Text, TooltipProvider } from "@medusajs/ui";
import { Suspense } from "react";
import DeferredComponent from "../../layout/deferred-component";
import { LicenseManager } from "./_manager";

const LicensesPage = () => {
  return (
    <TooltipProvider>
      <Suspense
        fallback={
          <DeferredComponent>
            <div className="flex items-center gap-2 px-4 py-2 rounded-md ">
              <Spinner className="animate-spin text-ui-fg-muted" />
              <Text className="text-ui-fg-subtle">데이터 로딩 중...</Text>
            </div>
          </DeferredComponent>
        }
      >
        <LicenseManager />
      </Suspense>
    </TooltipProvider>
  );
};

export default LicensesPage;

export const config = defineRouteConfig({
  label: "Licenses",
  icon: Key,
});
