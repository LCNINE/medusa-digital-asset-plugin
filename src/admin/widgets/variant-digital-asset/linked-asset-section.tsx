import { Spinner } from "@medusajs/icons";
import { Avatar, Button, Prompt, Text } from "@medusajs/ui";
import { Suspense } from "react";
import { useModalStore } from "../../store/modal-store";
import { useDigitalAssetLinkedVariant } from "../../hooks/use-digital-asset-linked-variant";
import { AssetDetailsModal, AssetFormModal } from "../../routes/digital-assets/_components";

interface ILinkedAssetSectionProps {
  variantId: string;
  onUnlink?: (assetId: string) => void;
  isUnLinking: boolean;
}

const LinkedAssetSection = ({ variantId, isUnLinking, onUnlink }: ILinkedAssetSectionProps) => {
  const { modalType, setModalType, selectedId, setSelectedId } = useModalStore();
  const { data: linkedAssets } = useDigitalAssetLinkedVariant(variantId);

  const handleUnlink = (assetId: string) => {
    if (onUnlink) {
      onUnlink(assetId);
    }
  };

  const handleModalClose = () => {
    setModalType(null);
    setSelectedId(null);
  };

  return (
    <div className="mb-4 px-2 sm:px-0">
      <Text className="text-ui-fg-subtle mb-2 text-sm sm:text-base">현재 연결된 디지털 자산:</Text>
      {linkedAssets?.map((asset) => (
        <div
          key={asset?.id}
          className="flex flex-col sm:flex-row items-start sm:items-center p-3 bg-ui-bg-subtle rounded-md mb-3 shadow-sm cursor-pointer"
          onClick={() => {
            setSelectedId(asset.id);
            setModalType("detail");
          }}
        >
          <div className="flex items-center w-full mb-2 sm:mb-0 h-full">
            <Avatar
              src={asset?.thumbnail_url as string}
              fallback=""
              className="mr-2 h-8 w-8 sm:h-10 sm:w-10 transition-transform duration-300 hover:scale-110"
            />
            <div className="flex-1 min-w-0">
              <Text className="font-medium text-sm sm:text-base truncate">{asset?.name}</Text>
              <Text className="text-xs sm:text-sm text-ui-fg-subtle truncate">
                {asset?.file_id}
              </Text>
            </div>
          </div>

          <Prompt>
            <Prompt.Trigger asChild>
              <Button
                variant="secondary"
                disabled={isUnLinking}
                className="w-full sm:w-auto mt-2 sm:mt-0 text-sm py-1.5 whitespace-nowrap transition-all duration-200 hover:bg-ui-bg-interactive hover:text-ui-fg-on-color hover:shadow-sm"
                size="small"
                onClick={(e) => e.stopPropagation()}
              >
                연결 해제
              </Button>
            </Prompt.Trigger>
            <Prompt.Content>
              <Prompt.Header>
                <Prompt.Title>정말 해제하시겠습니까?</Prompt.Title>
                <Prompt.Description>한번 해제한 디지털 자산은 복원이 안됩니다.</Prompt.Description>
              </Prompt.Header>
              <Prompt.Footer>
                <Prompt.Cancel onClick={(e) => e.stopPropagation()}>취소</Prompt.Cancel>
                <Prompt.Action
                  onClick={(e) => {
                    e.stopPropagation();
                    handleUnlink(asset.id);
                  }}
                >
                  {isUnLinking ? "처리 중..." : "해제"}
                </Prompt.Action>
              </Prompt.Footer>
            </Prompt.Content>
          </Prompt>
        </div>
      ))}

      {linkedAssets?.length === 0 && (
        <div className="p-4 bg-ui-bg-base border border-ui-border-base rounded-md text-center transition-all duration-200 hover:border-ui-border-interactive hover:shadow-sm">
          <Text className="text-ui-fg-subtle text-sm">연결된 디지털 자산이 없습니다.</Text>
        </div>
      )}

      <AssetDetailsModal
        isOpen={modalType === "detail"}
        onClose={handleModalClose}
        assetId={selectedId as string}
      />

      <AssetFormModal />
    </div>
  );
};

export const SuspenseLinkedAssetSection = (props: ILinkedAssetSectionProps) => (
  <Suspense
    fallback={
      <div className="flex justify-center items-center min-h-36">
        <Spinner />
      </div>
    }
  >
    <LinkedAssetSection {...props} />
  </Suspense>
);
