import { defineRouteConfig } from "@medusajs/admin-sdk";
import {
  Button,
  Container,
  Heading,
  Text,
  toast,
  Toaster,
  Switch,
  Checkbox,
  Label,
} from "@medusajs/ui";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { sdk } from "../../lib/config";
import { AssetDetailsModal, AssetList, CreateAssetModal, DigitalAsset } from "./_components";

const DigitalAssetsPage = () => {
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [includeDeleted, setIncludeDeleted] = useState(false);
  const queryClient = useQueryClient();

  const { data, isPending } = useQuery<{ digital_assets: DigitalAsset[] }>({
    queryKey: ["digital-assets", includeDeleted],
    queryFn: async () =>
      await sdk.client.fetch(`/admin/digital-assets?include_deleted=${includeDeleted}`),
  });

  const createAssetMutation = useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/admin/digital-assets", {
        method: "POST",
        body: formData,
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-assets"] });
      toast.success("디지털자산 생성이 완료되었습니다.");
      handleCreateModalClose();
    },
    onError: (error) => {
      console.error(error);
      toast.error("업로드 실패", {
        description: `파일 업로드 중 오류가 발생했습니다: ${error}`,
      });
    },
  });

  const deleteAssetMutation = useMutation({
    mutationFn: async (assetId: string) => {
      await fetch(`/admin/digital-assets/${assetId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-assets"] });
      toast.success("삭제 처리 되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("삭제 처리 중 오류가 발생했습니다.");
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
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-x-2">
            <Checkbox
              id="include-deleted"
              checked={includeDeleted}
              onCheckedChange={(checked) => {
                setIncludeDeleted(checked === true ? true : false);
              }}
            />
            <Label htmlFor="include-deleted">삭제된 자산 보기</Label>
          </div>
          <Button onClick={handleCreateModalOpen}>새 디지털 자산 생성</Button>
        </div>
      </div>

      <AssetList
        assets={data?.digital_assets || []}
        onViewAsset={handleViewAsset}
        onCreateAsset={handleCreateModalOpen}
        onDeleteAsset={deleteAssetMutation}
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
