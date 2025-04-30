import { FocusModal, Text, Button, Badge } from "@medusajs/ui";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { DigitalAsset } from "./types";

type AssetDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  asset: DigitalAsset | null;
};

const AssetDetailsModal = ({ isOpen, onClose, asset }: AssetDetailsModalProps) => {
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
        <FocusModal.Body className="flex flex-col md:flex-row gap-8 py-8 justify-center items-center m-auto px-2">
          <>
            {/* 썸네일 영역 */}
            <div className="w-full md:w-1/3 flex flex-col items-center ">
              {asset.thumbnail_url ? (
                <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={asset.thumbnail_url}
                    alt={asset.name || "썸네일"}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="w-full aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                  <Text className="text-gray-400">썸네일 없음</Text>
                </div>
              )}

              <div className="mt-4 w-full">
                <Button variant="primary" className="w-full" disabled={!asset.file_url}>
                  파일 다운로드
                </Button>
              </div>
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
                      {asset.deleted_at ? new Date(asset.deleted_at).toLocaleString() : "-"}
                    </Text>
                  </div>
                </div>
              </div>
            </div>
          </>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default AssetDetailsModal;
