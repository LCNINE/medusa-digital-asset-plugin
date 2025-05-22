import { Badge, Button, FocusModal, Text } from "@medusajs/ui";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import dayjs from "dayjs";
import { useFilteringStore } from "../../../../store/filtering-store";
import { useModalStore } from "../../../../store/modal-store";
import { useGetAssetById } from "../_hooks/use-get-asset-by-id";

type AssetDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  assetId: string;
};

const AssetDetailsModal = ({ isOpen, onClose, assetId }: AssetDetailsModalProps) => {
  const { setIsFormModalOpen, setSelectedId } = useModalStore();
  const { filtering } = useFilteringStore();

  const { data: asset, isLoading } = useGetAssetById(assetId, filtering.deleted_at as boolean);

  if (!asset) return null;

  return (
    <FocusModal open={isOpen} onOpenChange={onClose}>
      <FocusModal.Content aria-describedby={undefined}>
        <FocusModal.Header>
          <VisuallyHidden>
            <FocusModal.Title>디지털 자산 상세 정보</FocusModal.Title>
          </VisuallyHidden>
          <Text className="text-xl font-semibold">디지털 자산 상세 정보</Text>
        </FocusModal.Header>

        {!filtering.deleted_at && (
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedId(asset.id);
              setIsFormModalOpen(true);
            }}
            className="ml-auto mr-4 mt-4 p-4 sm:px-3 sm:py-2"
          >
            편집
          </Button>
        )}

        <FocusModal.Body className="flex flex-col md:flex-row gap-8 py-8 justify-center items-center m-auto px-2">
          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-ui-border-base border-t-ui-fg-base"></div>
              <Text className="text-ui-fg-subtle mt-4">로딩 중...</Text>
            </div>
          ) : (
            <>
              {/* 썸네일 영역 */}
              <div className="w-full md:w-1/3 flex flex-col items-center ">
                {asset?.thumbnail_url ? (
                  <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={asset.thumbnail_url}
                      alt={asset.name || "썸네일"}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="w-full bg-gray-100 rounded-lg flex items-center justify-center aspect-square sm:h-72 h-40">
                    <Text className="text-gray-400">썸네일 없음</Text>
                  </div>
                )}
              </div>

              {/* 상세 정보 영역 */}
              <div className="w-full md:w-2/3">
                <div className="space-y-6">
                  <div>
                    <Text className="text-gray-500 text-sm">ID</Text>
                    <Text className="font-medium">{asset.id}</Text>
                  </div>

                  <div>
                    <Text className="text-gray-500 text-sm">이름</Text>
                    <Text className="font-medium">{asset.name || "-"}</Text>
                  </div>

                  <div>
                    <Text className="text-gray-500 text-sm">MIME 타입</Text>
                    <Badge className="mt-1">{asset.mime_type || "-"}</Badge>
                  </div>

                  <div>
                    <Text className="text-gray-500 text-sm">파일 URL</Text>
                    <Text className="font-medium break-all">{asset.file_url || "-"}</Text>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Text className="text-gray-500 text-sm">생성일</Text>
                      <Text className="font-medium">
                        {new Date(asset.created_at).toLocaleString()}
                      </Text>
                    </div>

                    <div>
                      <Text className="text-gray-500 text-sm">삭제일</Text>
                      <Text className="font-medium">
                        {asset.deleted_at ? dayjs(asset.deleted_at).format("YYYY-MM-DD") : "-"}
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default AssetDetailsModal;
