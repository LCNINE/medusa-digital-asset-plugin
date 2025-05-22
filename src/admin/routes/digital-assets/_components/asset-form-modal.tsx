import { Button, FocusModal, Input, Label, Text } from "@medusajs/ui";
import { useEffect, useRef, useState } from "react";
import { useModalStore } from "../../../../store/modal-store";
import { useUpdateAssetMutation } from "../_hooks/use-update-asset";
import { useCreateAssetMutation } from "../_hooks/use-create-asset";
import { useGetAssetById } from "../_hooks/use-get-asset-by-id";

const AssetFormModal = () => {
  const [newAssetName, setNewAssetName] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null);
  const [fileUrl, setFileUrl] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const { isFormModalOpen, setIsFormModalOpen, selectedId, setSelectedId } = useModalStore();
  const createAssetMutation = useCreateAssetMutation();
  const updateAssetMutation = useUpdateAssetMutation();

  const { data: currentAsset } = useGetAssetById(selectedId as string, false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "file") {
      setSelectedFile(file);
    } else if (type === "thumbnail") {
      setSelectedThumbnail(file);

      const reader = new FileReader();
      reader.onloadend = () => {
        setThumbnailPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
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

    if (currentAsset?.id) {
      updateAssetMutation.mutate({ id: currentAsset.id, formData });
    } else {
      createAssetMutation.mutate(formData, {
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

  useEffect(() => {
    if (currentAsset) {
      setNewAssetName(currentAsset.name);
      setFileUrl(currentAsset.file_url);
      setThumbnailPreview(currentAsset.thumbnail_url || null);
      setSelectedFile(null);
      setSelectedThumbnail(null);
    }
  }, [currentAsset]);

  const modalTitle = currentAsset ? "디지털 자산 편집" : "새 디지털 자산 생성";

  return (
    <FocusModal open={isFormModalOpen} onOpenChange={handleModalClose}>
      <FocusModal.Content aria-describedby={undefined}>
        <FocusModal.Header>
          <FocusModal.Title>{modalTitle}</FocusModal.Title>
        </FocusModal.Header>
        <FocusModal.Body className="py-8 px-4">
          <form onSubmit={handleCreateAsset} className="space-y-8 max-w-2xl mx-auto">
            {/* 자산 이름 입력 */}
            <div>
              <Label htmlFor="asset-name" className="text-base font-medium">
                자산 이름
              </Label>
              <Input
                id="asset-name"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                placeholder="디지털 자산 이름을 입력하세요"
                required
                className="mt-2"
              />
            </div>

            {/* 파일 업로드 섹션 */}
            <div className="border rounded-lg p-5">
              <h3 className="text-base font-medium mb-4">필수 파일 업로드</h3>
              <div className="flex items-center gap-4">
                <div className="flex-grow">
                  <input
                    id="file-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e, "file")}
                    className="hidden"
                    required={!currentAsset && !selectedFile && !fileUrl}
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    파일 선택
                  </Button>
                </div>
                <div className="flex-grow">
                  {selectedFile ? (
                    <Text className="text-sm p-2 rounded border">
                      선택된 파일: {selectedFile.name}
                    </Text>
                  ) : fileUrl ? (
                    <Text className="text-sm p-2 rounded border break-all">
                      현재 파일: {fileUrl}
                    </Text>
                  ) : (
                    <Text className="text-sm text-gray-500 p-2">
                      아직 파일이 선택되지 않았습니다.
                    </Text>
                  )}
                </div>
              </div>
            </div>

            {/* 썸네일 업로드 섹션 */}
            <div className="border rounded-lg p-5">
              <h3 className="text-base font-medium mb-4">썸네일 업로드 (선택사항)</h3>
              <div className="flex flex-col gap-4">
                <div className="w-40 h-40 aspect-square bg-gray-100 rounded-lg overflow-hidden">
                  {thumbnailPreview ? (
                    <img
                      src={thumbnailPreview}
                      alt="썸네일 미리보기"
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Text className="text-gray-400">썸네일 없음</Text>
                    </div>
                  )}
                </div>
                <div className="flex items-center gap-4">
                  <input
                    id="thumbnail-upload"
                    type="file"
                    ref={thumbnailInputRef}
                    onChange={(e) => handleFileChange(e, "thumbnail")}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    썸네일 선택
                  </Button>

                  {selectedThumbnail && (
                    <Text className="text-sm text-gray-500">{selectedThumbnail.name}</Text>
                  )}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-2">
              <Button type="button" variant="secondary" onClick={handleModalClose}>
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  currentAsset
                    ? updateAssetMutation.isPending ||
                      !newAssetName ||
                      (newAssetName === currentAsset.name && !selectedFile && !selectedThumbnail)
                    : createAssetMutation.isPending || !newAssetName || (!selectedFile && !fileUrl)
                }
              >
                {currentAsset
                  ? updateAssetMutation.isPending
                    ? "업데이트 중..."
                    : "업데이트"
                  : createAssetMutation.isPending
                    ? "생성 중..."
                    : "생성"}
              </Button>
            </div>
          </form>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default AssetFormModal;
