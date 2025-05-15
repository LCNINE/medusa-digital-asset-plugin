import { Button, Checkbox, CommandBar, Prompt, Table, Text, toast } from "@medusajs/ui";
import dayjs from "dayjs";
import { useState } from "react";
import { useDigitalAsset } from "../_context";
import {
  useDeleteAssetMutation,
  useDeleteAssetsMutation,
} from "../_hooks/digital-assets/use-delete-asset";
import { useRestoreAssetsMutation } from "../_hooks/digital-assets/use-restore-asset";
import { DigitalAsset } from "../../../../types/digital-asset.types";

type AssetListProps = {
  assets: DigitalAsset[];
  onViewAsset: (assetId: string) => void;
  pagination?: {
    count: number;
    offset: number;
    limit: number;
  };
  onPageChange?: (page: number) => void;
};

const AssetList = ({ assets, onViewAsset, pagination, onPageChange }: AssetListProps) => {
  const {
    selectedAssets,
    setSelectedAssets,
    isDeleteModalOpen,
    setIsDeleteModalOpen,
    setIsAssetFormModalOpen,
  } = useDigitalAsset();

  const deleteAsset = useDeleteAssetMutation();
  const deleteAssets = useDeleteAssetsMutation();
  const restoreAssets = useRestoreAssetsMutation();

  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isRestoreModalOpen, setIsRestoreModalOpen] = useState(false);

  const handleDeleteClick = (assetId: string) => {
    setSelectedAssetId(assetId);
    setIsDeleteModalOpen(true);
  };

  const handleRestoreClick = (assetId: string) => {
    setSelectedAssetId(assetId);
    setIsRestoreModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setIsRestoreModalOpen(false);
    setSelectedAssetId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAssetId) {
      deleteAsset.mutate(selectedAssetId);
      handleCloseModal();
    }
  };

  const handleConfirmRestore = () => {
    if (selectedAssetId) {
      restoreAssets.mutate([selectedAssetId]);
      handleCloseModal();
    }
  };

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) {
      setSelectedAssets((prev) => [...prev, assetId]);
    } else {
      setSelectedAssets((prev) => prev.filter((id) => id !== assetId));
    }
  };

  const handleDeleteSelected = () => {
    alert(`선택한 ${selectedAssets.length}개 항목을 삭제합니다.`);
    deleteAssets.mutate(selectedAssets, {
      onSuccess: () => {
        setSelectedAssets([]);
      },
    });
  };

  const handleRestoreSelected = () => {
    // 선택된 항목 중 삭제된 자산만 필터링
    const deletedAssetIds = selectedAssets.filter((id) => {
      const asset = assets.find((a) => a.id === id);
      return asset && asset.deleted_at;
    });

    if (deletedAssetIds.length === 0) {
      toast.error("복구할 삭제된 항목이 없습니다.");
      return;
    }

    alert(`선택한 ${selectedAssets.length}개 항목을 복구합니다.`);

    restoreAssets.mutate(deletedAssetIds, {
      onSuccess: () => {
        setSelectedAssets([]);
      },
    });
  };

  const handleViewSelected = () => {
    if (selectedAssets.length !== 1) {
      toast.error("편집할 항목은 한개만 선택해주세요.");
      return;
    }

    if (selectedAssets.length === 1) {
      const asset = assets.find((a) => a.id === selectedAssets[0]);

      if (asset) {
        setSelectedAssetId(asset.id);
        setIsAssetFormModalOpen(true);
      }
    }
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Text>디지털 자산이 없습니다</Text>
        <Button variant="secondary" className="mt-4" onClick={() => setIsAssetFormModalOpen(true)}>
          새 디지털 자산 생성
        </Button>
      </div>
    );
  }

  const totalPages = pagination ? Math.ceil(pagination.count / pagination.limit) : 1;
  const currentPage = pagination ? Math.floor(pagination.offset / pagination.limit) + 1 : 1;

  const handlePreviousPage = () => {
    if (currentPage > 1 && onPageChange) {
      onPageChange(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages && onPageChange) {
      onPageChange(currentPage + 1);
    }
  };

  // 선택된 항목 중 삭제된 자산이 있는지 확인
  const hasDeletedAssetsSelected = selectedAssets.some((id) => {
    const asset = assets.find((a) => a.id === id);
    return asset && asset.deleted_at;
  });

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>
              <Checkbox
                checked={selectedAssets.length > 0 && selectedAssets.length === assets.length}
                onCheckedChange={(checked) => {
                  if (checked) {
                    setSelectedAssets(assets.map((asset) => asset.id));
                  } else {
                    setSelectedAssets([]);
                  }
                }}
              />
            </Table.HeaderCell>
            <Table.HeaderCell>ID</Table.HeaderCell>
            <Table.HeaderCell>이름</Table.HeaderCell>
            <Table.HeaderCell>타입</Table.HeaderCell>
            <Table.HeaderCell>생성일</Table.HeaderCell>
            <Table.HeaderCell>상태</Table.HeaderCell>
            <Table.HeaderCell>상품</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {assets.map((asset: DigitalAsset) => (
            <Table.Row key={asset.id}>
              <Table.Cell>
                <Checkbox
                  checked={selectedAssets.includes(asset.id)}
                  onCheckedChange={(checked) =>
                    handleSelectAsset(asset.id, checked === true ? true : false)
                  }
                />
              </Table.Cell>
              <Table.Cell>{asset.id}</Table.Cell>
              <Table.Cell>{asset.name || "-"}</Table.Cell>
              <Table.Cell>{asset.mime_type || "-"}</Table.Cell>
              <Table.Cell>{dayjs(asset.created_at).format("YYYY-MM-DD")}</Table.Cell>
              <Table.Cell>
                {asset.deleted_at ? (
                  <span className="text-red-500">
                    삭제됨 ({dayjs(asset.deleted_at).format("YYYY-MM-DD")})
                  </span>
                ) : (
                  <span className="text-green-500">활성화</span>
                )}
              </Table.Cell>
              <Table.Cell>
                <div className="flex gap-2">
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={() => {
                      onViewAsset(asset.id);
                    }}
                  >
                    보기
                  </Button>
                  {!asset.deleted_at ? (
                    <Button
                      variant="danger"
                      size="small"
                      onClick={() => handleDeleteClick(asset.id)}
                    >
                      삭제
                    </Button>
                  ) : (
                    <Button
                      variant="secondary"
                      size="small"
                      onClick={() => handleRestoreClick(asset.id)}
                    >
                      복구
                    </Button>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

      {pagination && pagination.count > pagination.limit && (
        <div className="flex justify-center items-center gap-4 mt-6">
          <Button
            variant="secondary"
            size="small"
            onClick={handlePreviousPage}
            disabled={currentPage === 1}
          >
            이전
          </Button>
          <Text>
            {currentPage} / {totalPages} 페이지 (총 {pagination.count}개)
          </Text>
          <Button
            variant="secondary"
            size="small"
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
          >
            다음
          </Button>
        </div>
      )}

      <CommandBar open={selectedAssets.length > 0}>
        <CommandBar.Bar>
          {!hasDeletedAssetsSelected ? (
            <>
              <CommandBar.Value>{selectedAssets.length}개 선택됨</CommandBar.Value>
              <CommandBar.Seperator />
              <CommandBar.Command action={handleDeleteSelected} label="삭제" shortcut="d" />

              <CommandBar.Seperator />
              <CommandBar.Command
                action={handleViewSelected}
                label="편집"
                shortcut="v"
                disabled={selectedAssets.length !== 1}
              />
            </>
          ) : (
            <>
              <CommandBar.Value>{selectedAssets.length}개 선택됨</CommandBar.Value>

              <CommandBar.Seperator />
              <CommandBar.Command action={handleRestoreSelected} label="복구" shortcut="r" />
            </>
          )}
        </CommandBar.Bar>
      </CommandBar>

      {/* 삭제 모달 */}
      <Prompt open={isDeleteModalOpen} onOpenChange={setIsDeleteModalOpen}>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>디지털 자산 삭제</Prompt.Title>
            <Prompt.Description>
              정말로 이 디지털 자산을 삭제하시겠습니까? <br />
              해당 자산은 더 이상 판매 중인 상품에서 사용할 수 없습니다.
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={handleCloseModal}>취소</Prompt.Cancel>
            <Prompt.Action onClick={handleConfirmDelete} disabled={deleteAsset.isPending}>
              {deleteAsset.isPending ? "삭제 중..." : "삭제"}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>

      {/* 복구 모달 */}
      <Prompt open={isRestoreModalOpen} onOpenChange={setIsRestoreModalOpen}>
        <Prompt.Content>
          <Prompt.Header>
            <Prompt.Title>디지털 자산 복구</Prompt.Title>
            <Prompt.Description>
              삭제된 디지털 자산을 복구하시겠습니까? <br />
              복구 시 해당 자산은 다시 활성화되어 사용할 수 있습니다.
            </Prompt.Description>
          </Prompt.Header>
          <Prompt.Footer>
            <Prompt.Cancel onClick={handleCloseModal}>취소</Prompt.Cancel>
            <Prompt.Action onClick={handleConfirmRestore} disabled={restoreAssets.isPending}>
              {restoreAssets.isPending ? "복구 중..." : "복구"}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
};

export default AssetList;
