import { Container, Text, Toaster } from "@medusajs/ui";
import { Suspense } from "react";
import { AssetDetailsModal, AssetFormModal } from "./_components";

import { Spinner } from "@medusajs/icons";
import { useDigitalAssetStore } from "../../../store/digital-asset-store";
import DeferredComponent from "../../layout/deferred-component";
import AssetListTable from "./_components/asset-list-table";
import { Header } from "./_components/header";

const DigitalAssetManager = () => {
  const {
    isModalOpen,
    setIsModalOpen,
    selectedAssetId,
    setSelectedAssetId,
    setIsAssetFormModalOpen,
  } = useDigitalAssetStore();

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAssetId(null);
  };

  return (
    <Container>
      <Toaster />

      <Header
        title="Digital Assets"
        subtitle="관리자는 이 페이지에서 디지털 자산을 관리할 수 있습니다."
        actions={[
          {
            type: "button",
            props: {
              children: <>Create</>,
              onClick: () => {
                setIsAssetFormModalOpen(true);
              },
            },
          },
        ]}
      />

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
        <AssetListTable
          onViewAsset={(assetId: string) => {
            setSelectedAssetId(assetId);
            setIsModalOpen(true);
          }}
        />
      </Suspense>

      <AssetDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        assetId={selectedAssetId as string}
      />

      <AssetFormModal />
    </Container>
  );
};

export default DigitalAssetManager;
