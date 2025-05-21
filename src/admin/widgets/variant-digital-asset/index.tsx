import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { AdminProductVariant, DetailWidgetProps } from "@medusajs/framework/types";
import { Container, Heading } from "@medusajs/ui";
import { useState } from "react";
import { DigitalAsset } from "../../../../.medusa/types/query-entry-points";
import { DigitalAssetSelector } from "../../components/digital-asset-selector";
import { useLinkDigitalAssetToVariant } from "../../hooks/use-link-digital-asset-to-variant";
import { useUnLinkDigitalAssetToVariant } from "../../hooks/use-unlink-digital-asset-to-variant";
import { SuspenseLinkedAssetSection } from "./linked-asset-section";

const VariantDigitalAssetWidget = ({ data }: DetailWidgetProps<AdminProductVariant>) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);

  const linkDigitalAssetToVariant = useLinkDigitalAssetToVariant(); // digital asset 연결
  const unlinkDigitalAssetToVariant = useUnLinkDigitalAssetToVariant(); // digital asset 연결 해제

  const handleLinkAsset = (assetId: string) => {
    linkDigitalAssetToVariant.mutate(
      {
        digital_asset_id: assetId,
        variant_id: data.id,
      },
      {
        onSuccess: () => {
          setSelectedAssetId(null);
        },
        onError: () => {},
      },
    );
  };

  const handleUnlinkAsset = (assetId: string) => {
    unlinkDigitalAssetToVariant.mutate({
      digital_asset_id: assetId,
      variant_id: data.id,
    });
  };

  return (
    <Container className="divide-y p-0">
      <div className="flex items-center justify-between px-6 py-4">
        <Heading level="h2">디지털 자산</Heading>
      </div>

      <div className="p-6">
        <SuspenseLinkedAssetSection
          variantId={data.id}
          isUnLinking={unlinkDigitalAssetToVariant.isPending}
          onUnlink={handleUnlinkAsset}
        />

        <DigitalAssetSelector
          variantId={data.id}
          selectedAssetId={selectedAssetId}
          setSelectedAssetId={setSelectedAssetId}
          onLink={handleLinkAsset}
          isLinking={linkDigitalAssetToVariant.isPending}
          selectedAsset={selectedAsset}
          setSelectedAsset={setSelectedAsset}
        />
      </div>
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product_variant.details.before",
});

export default VariantDigitalAssetWidget;
