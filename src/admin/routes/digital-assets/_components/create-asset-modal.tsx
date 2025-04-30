import { FocusModal, Text, Button, Input, Label } from "@medusajs/ui";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { useState, useRef } from "react";
import { UseMutationResult } from "@tanstack/react-query";

type CreateAssetModalProps = {
  isOpen: boolean;
  onClose: () => void;
  createAssetMutation: UseMutationResult<any, unknown, FormData, unknown>;
};

const CreateAssetModal = ({ isOpen, onClose, createAssetMutation }: CreateAssetModalProps) => {
  const [newAssetName, setNewAssetName] = useState("");
  const [thumbnailPreview, setThumbnailPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const thumbnailInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, type: "file" | "thumbnail") => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (type === "thumbnail") {
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

    if (fileInputRef.current?.files?.[0]) {
      formData.append("files", fileInputRef.current.files[0]);
    }

    if (thumbnailInputRef.current?.files?.[0]) {
      formData.append("files", thumbnailInputRef.current.files[0]);
      formData.append("thumbnail", "true");
    }

    createAssetMutation.mutate(formData);
  };

  const handleModalClose = () => {
    setNewAssetName("");
    setThumbnailPreview(null);
    onClose();
  };

  return (
    <FocusModal open={isOpen} onOpenChange={handleModalClose}>
      <FocusModal.Content aria-describedby={undefined}>
        <FocusModal.Header>
          <VisuallyHidden>
            <FocusModal.Title>새 디지털 자산 생성</FocusModal.Title>
          </VisuallyHidden>
          <Text className="text-xl font-semibold">새 디지털 자산 생성</Text>
        </FocusModal.Header>
        <FocusModal.Body className="py-8 px-4">
          <form onSubmit={handleCreateAsset} className="space-y-6 max-w-2xl mx-auto">
            <div>
              <Label htmlFor="asset-name">자산 이름</Label>
              <Input
                id="asset-name"
                value={newAssetName}
                onChange={(e) => setNewAssetName(e.target.value)}
                placeholder="디지털 자산 이름을 입력하세요"
                required
                className="mt-1"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 파일 업로드 - 심플한 버전 */}
              <div>
                <Label htmlFor="file-upload">파일 업로드</Label>
                <div className="mt-1">
                  <input
                    id="file-upload"
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileChange(e, "file")}
                    className="hidden"
                    required
                  />
                  <Button
                    type="button"
                    variant="secondary"
                    className="w-full"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    파일 선택
                  </Button>
                  {fileInputRef.current?.files?.[0] && (
                    <Text className="mt-2 text-sm">
                      선택된 파일: {fileInputRef.current.files[0].name}
                    </Text>
                  )}
                </div>
              </div>

              {/* 썸네일 업로드 */}
              <div>
                <Label htmlFor="thumbnail-upload">썸네일 업로드 (선택사항)</Label>
                <div className="mt-1">
                  <div className="w-full aspect-square bg-gray-100 rounded-lg overflow-hidden mb-2">
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
                    className="w-full"
                    onClick={() => thumbnailInputRef.current?.click()}
                  >
                    썸네일 선택
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-2">
              <Button type="button" variant="secondary" onClick={handleModalClose}>
                취소
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={
                  createAssetMutation.isPending ||
                  !newAssetName ||
                  !fileInputRef.current?.files?.[0]
                }
              >
                {createAssetMutation.isPending ? "저장 중..." : "저장"}
              </Button>
            </div>
          </form>
        </FocusModal.Body>
      </FocusModal.Content>
    </FocusModal>
  );
};

export default CreateAssetModal;
