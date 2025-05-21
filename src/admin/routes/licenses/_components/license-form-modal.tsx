import { Button, FocusModal, Text } from "@medusajs/ui";
import { useState } from "react";
import { DigitalAsset, DigitalAssetLicense } from "../../../../../.medusa/types/query-entry-points";
import { useModalStore } from "../../../../store/modal-store";
import { DigitalAssetSelector } from "../../../components/digital-asset-selector";
import { useCreateLicense } from "../_hooks/use-create-license";
import { useUpdateLicense } from "../_hooks/use-update-license";

interface ILicenseFormModalProps {
  license: DigitalAssetLicense | undefined;
  isLoading: boolean;
  type: "create" | "edit";
}

const LicenseFormModal = ({ license, isLoading, type }: ILicenseFormModalProps) => {
  const [newAssetName, setNewAssetName] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);

  const { modalType, isFormModalOpen, setIsFormModalOpen, selectedId, setSelectedId } =
    useModalStore();
  const createLicenseMutation = useCreateLicense();
  const updateLicenseMutation = useUpdateLicense();

  console.log("currentLicense:", license);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "thumbnail") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "thumbnail") {
      setSelectedThumbnail(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLinkAsset = (assetId: string) => {
    // TODO: 라이센스랑 연결할게있는지?
    // linkDigitalAssetToVariant.mutate(
    //   {
    //     digital_asset_id: assetId,
    //     variant_id: data.id,
    //   },
    //   {
    //     onSuccess: () => {
    //       setSelectedAssetId(null);
    //     },
    //     onError: () => {},
    //   },
    // );
  };

  const handleCreateAsset = (e: React.FormEvent) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("name", newAssetName);

    if (selectedFile) {
      formData.append("file", selectedFile);
    }

    if (selectedThumbnail) {
      formData.append("thumbnail", selectedThumbnail);
    }

    if (license?.id) {
      updateLicenseMutation.mutate(
        { id: license.id, formData },
        {
          onSuccess: () => {
            setIsFormModalOpen(false);
          },
        },
      );
    } else {
      createLicenseMutation.mutate(formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
        },
      });
    }
  };

  const handleModalClose = () => {
    setNewAssetName("");
    setThumbnailPreview(null);
    setSelectedFile(null);
    setSelectedThumbnail(null);
    setIsFormModalOpen(false);
    setFileUrl(null);
    setSelectedId(null);
  };

  // useEffect(() => {
  //   if (currentLicense) {
  //     setNewAssetName(currentLicense?.name);
  //     setFileUrl(currentLicense.file_url);
  //     setThumbnailPreview(currentLicense.thumbnail_url || null);
  //     setSelectedFile(null);
  //     setSelectedThumbnail(null);
  //   }
  // }, [currentLicense]);

  const modalTitle = type === "create" ? "새 라이센스 생성" : "라이센스 편집";

  return (
    <FocusModal open={isFormModalOpen} onOpenChange={handleModalClose}>
      <FocusModal.Content aria-describedby={undefined}>
        <FocusModal.Header>
          <FocusModal.Title>{modalTitle}</FocusModal.Title>
        </FocusModal.Header>

        <FocusModal.Body className="py-8 px-4">
          {isLoading ? (
            <div className="w-full flex flex-col items-center justify-center py-16">
              <div className="animate-spin rounded-full h-12 w-12 border-2 border-ui-border-base border-t-ui-fg-base"></div>
              <Text className="text-ui-fg-subtle mt-4">로딩 중...</Text>
            </div>
          ) : (
            <form onSubmit={handleCreateAsset} className="space-y-8 max-w-2xl mx-auto">
              {/* 디지털 자산 셀렉터 */}
              <DigitalAssetSelector
                selectedAssetId={selectedId}
                setSelectedAssetId={setSelectedId}
                selectedAsset={selectedAsset}
                setSelectedAsset={setSelectedAsset}
                isLinking={false}
              />
              // 이곳에
              <div className="flex justify-end gap-3 pt-2">
                <Button type="button" variant="secondary" onClick={handleModalClose}>
                  취소
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={
                    license
                      ? updateLicenseMutation.isPending ||
                        !newAssetName ||
                        (newAssetName === license.name && !selectedFile && !selectedThumbnail)
                      : createLicenseMutation.isPending ||
                        !newAssetName ||
                        (!selectedFile && !fileUrl)
                  }
                >
                  {license
                    ? updateLicenseMutation.isPending
                      ? "업데이트 중..."
                      : "업데이트"
                    : createLicenseMutation.isPending
                      ? "생성 중..."
                      : "생성"}
                </Button>
              </div>
            </form>
          )}
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default LicenseFormModal;
