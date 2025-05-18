import { Container, Heading, Text, Toaster } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useState } from "react";
import { sdk } from "../../lib/config";
import { AssetDetailsModal, AssetFormModal, AssetList } from "./_components";

import { DigitalAsset } from "../../../types/digital-asset.types";
import CreateDigitalAssetBtn from "./_components/create-digital-asset-btn";
import ViewDeletedAssetsBtn from "./_components/view-deleted-assets-btn";
import { useDigitalAssetStore } from "../../../store/digital-asset";

const DigitalAssetManager = () => {
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const [offset, setOffset] = useState(0);
  const limit = 20;

  const { isModalOpen, setIsModalOpen, selectedAssetId, setSelectedAssetId } =
    useDigitalAssetStore();

  const { data, isPending } = useQuery<{
    digital_assets: DigitalAsset[];
    pagination: {
      count: number;
      offset: number;
      limit: number;
    };
  }>({
    queryKey: ["digital-assets", includeDeleted, offset, limit],
    queryFn: async () =>
      await sdk.client.fetch(
        `/admin/digital-assets?include_deleted=${includeDeleted}&offset=${offset}&limit=${limit}`,
      ),
  });

  const handleViewAsset = (assetId: string) => {
    setSelectedAssetId(assetId);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAssetId(null);
  };

  if (isPending) {
    return (
      <Container className="flex items-center justify-center p-10">
        <Text>로딩 중...</Text>
      </Container>
    );
  }

  return (
    <Container>
      <Toaster />
      <div className="mb-6 flex items-center justify-between">
        <Heading level="h1">디지털 자산</Heading>

        <div className="flex items-center gap-2">
          {/* 삭제된 자산 보기 체크 버튼 */}
          <ViewDeletedAssetsBtn
            includeDeleted={includeDeleted}
            setIncludeDeleted={setIncludeDeleted}
            setOffset={setOffset}
          />

          {/* 새 디지털 자산 생성 */}
          <CreateDigitalAssetBtn />
        </div>
      </div>

      <AssetList
        assets={data?.digital_assets || []}
        onViewAsset={handleViewAsset}
        pagination={data?.pagination}
        onPageChange={(page: number) => {
          setOffset((page - 1) * limit);
        }}
      />

      <AssetDetailsModal
        isOpen={isModalOpen}
        onClose={handleModalClose}
        assetId={selectedAssetId as string}
        includeDeleted={includeDeleted}
      />

      <AssetFormModal />
    </Container>
  );
};

export default DigitalAssetManager;
