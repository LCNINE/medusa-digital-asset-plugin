import { Badge, Button, Container, FocusModal, Heading, Text } from "@medusajs/ui";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import dayjs from "dayjs";
import { DigitalAssetLicense } from "../../../../../.medusa/types/query-entry-points";
import { useFilteringStore } from "../../../../store/filtering-store";
import { useModalStore } from "../../../../store/modal-store";

type LicenseDetailsModalProps = {
  isOpen: boolean;
  onClose: () => void;
  license: DigitalAssetLicense | undefined;
  isLoading: boolean;
};

const LicenseDetailsModal = ({ isOpen, onClose, license, isLoading }: LicenseDetailsModalProps) => {
  const { setIsFormModalOpen, setSelectedId } = useModalStore();
  const { filtering } = useFilteringStore();

  if (!license) return null;

  return (
    <FocusModal open={isOpen} onOpenChange={onClose}>
      <FocusModal.Content aria-describedby={undefined}>
        <FocusModal.Header>
          <VisuallyHidden>
            <FocusModal.Title>디지털 자산 상세 정보</FocusModal.Title>
          </VisuallyHidden>
          <Text className="text-xl font-semibold">디지털 자산 상세 정보</Text>
        </FocusModal.Header>

        {!filtering?.deleted_at && (
          <Button
            variant="secondary"
            onClick={() => {
              setSelectedId(license.id);
              setIsFormModalOpen(true);
            }}
            className="ml-auto mr-4 mt-4 p-4 sm:px-3 sm:py-2"
          >
            편집
          </Button>
        )}

        <FocusModal.Body className="flex flex-col px-6 py-8">
          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-ui-border-base border-t-ui-fg-base"></div>
              <Text className="text-ui-fg-subtle mt-4">로딩 중...</Text>
            </div>
          ) : (
            <div className="flex flex-col lg:flex-row gap-8 w-full">
              {/* 썸네일 영역 */}
              <div className="w-full lg:w-1/3 flex flex-col items-center gap-4 relative">
                <Badge
                  className="absolute top-5 right-5"
                  color={license.is_exercised ? "red" : "green"}
                >
                  {license.is_exercised ? "사용됌" : "사용되지 않음"}
                </Badge>

                {license.digital_asset?.thumbnail_url ? (
                  <div className="w-full aspect-square rounded-lg overflow-hidden bg-ui-bg-subtle flex items-center justify-center">
                    <img
                      src={license.digital_asset.thumbnail_url}
                      alt={license.digital_asset.name}
                      className="max-w-full max-h-full object-contain"
                    />
                  </div>
                ) : (
                  <div className="w-full aspect-square rounded-lg bg-ui-bg-subtle flex items-center justify-center">
                    <Text className="text-ui-fg-subtle">썸네일 없음</Text>
                  </div>
                )}
              </div>

              {/* 정보 영역 */}
              <div className="w-full lg:w-2/3">
                <Container className="mb-6">
                  <Heading className="px-4 py-2 border-b">라이센스 정보</Heading>
                  <div className="p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <Text className="text-ui-fg-subtle font-medium w-36">라이센스 ID:</Text>
                      <Text className="break-all">{license.id}</Text>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <Text className="text-ui-fg-subtle font-medium w-36">생성일:</Text>
                      <Text>{dayjs(license.created_at).format("YYYY-MM-DD")}</Text>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <Text className="text-ui-fg-subtle font-medium w-36">사용일:</Text>
                      <Text>
                        {license.is_exercised
                          ? dayjs(license.updated_at).format("YYYY-MM-DD")
                          : "-"}
                      </Text>
                    </div>
                  </div>
                </Container>

                <Container className="mb-6">
                  <Heading className="px-4 py-2 border-b">고객 정보</Heading>
                  <div className="p-4 space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <Text className="text-ui-fg-subtle font-medium w-36">고객 ID:</Text>
                      <Text>{license.customer_id}</Text>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <Text className="text-ui-fg-subtle font-medium w-36">고객 명:</Text>
                      <Text>
                        {license.customer?.first_name} {license.customer?.last_name}
                      </Text>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <Text className="text-ui-fg-subtle font-medium w-36">이메일:</Text>
                      <Text>{license.customer?.email}</Text>
                    </div>
                  </div>
                </Container>

                <Container>
                  <Heading className="px-4 py-2 border-b">디지털 자산 정보</Heading>
                  <div className="p-4 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <Text className="text-ui-fg-subtle font-medium w-36">자산 ID:</Text>
                      <Text>{license.digital_asset?.id}</Text>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <Text className="text-ui-fg-subtle font-medium w-36">자산명:</Text>
                      <Text>{license.digital_asset?.name}</Text>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4">
                      <Text className="text-ui-fg-subtle font-medium w-36">파일 유형:</Text>
                      <Text>{license.digital_asset?.mime_type}</Text>
                    </div>
                    <div className="flex flex-col sm:flex-row sm:items-start gap-1 sm:gap-4">
                      <Text className="text-ui-fg-subtle font-medium w-36">파일 URL:</Text>
                      <Text className="break-all">{license.digital_asset?.file_url}</Text>
                    </div>
                  </div>
                </Container>
              </div>
            </div>
          )}
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default LicenseDetailsModal;
