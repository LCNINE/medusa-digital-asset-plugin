import { defineRouteConfig } from "@medusajs/admin-sdk";
import { Button, Container, Heading, Text, toast, Toaster } from "@medusajs/ui";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { sdk } from "../../lib/config";
import { AssetDetailsModal, CreateAssetModal, AssetList, DigitalAsset } from "./_components";

const DigitalAssetsPage = () => {
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery<{ digital_assets: DigitalAsset[] }>({
    queryKey: ["digital-assets"],
    queryFn: async () => await sdk.client.fetch("/admin/digital-assets"),
  });

  const createAssetMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await sdk.client.fetch("/admin/digital-assets", {
        method: "POST",
        body: formData,
      });
      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-assets"] });
      handleCreateModalClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("업로드 실패", {
        description: `파일 업로드 중 오류가 발생했습니다: ${error}`,
      });
    },
  });

  const handleViewAsset = (asset: DigitalAsset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  const handleCreateModalOpen = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateModalClose = () => {
    setIsCreateModalOpen(false);
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
        <Button onClick={handleCreateModalOpen}>새 디지털 자산 생성</Button>
      </div>

      <AssetList
        assets={data?.digital_assets || []}
        onViewAsset={handleViewAsset}
        onCreateAsset={handleCreateModalOpen}
      />

      <AssetDetailsModal isOpen={isModalOpen} onClose={handleModalClose} asset={selectedAsset} />

      <CreateAssetModal
        isOpen={isCreateModalOpen}
        onClose={handleCreateModalClose}
        createAssetMutation={createAssetMutation}
      />
    </Container>
  );
};

export default DigitalAssetsPage;

export const config = defineRouteConfig({
  label: "Digital asset",
});
