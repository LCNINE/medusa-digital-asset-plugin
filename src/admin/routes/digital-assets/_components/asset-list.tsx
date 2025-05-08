import { Button, Table, Text, Prompt } from "@medusajs/ui";
import { UseMutationResult } from "@tanstack/react-query";
import dayjs from "dayjs";
import { DigitalAsset } from "./types";
import { useState } from "react";

type AssetListProps = {
  assets: DigitalAsset[];
  onViewAsset: (asset: DigitalAsset) => void;
  onCreateAsset: () => void;
  onDeleteAsset: UseMutationResult<any, unknown, string, unknown>;
};

const AssetList = ({ assets, onViewAsset, onCreateAsset, onDeleteAsset }: AssetListProps) => {
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const handleDeleteClick = (assetId: string) => {
    setSelectedAssetId(assetId);
    setIsDeleteModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsDeleteModalOpen(false);
    setSelectedAssetId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedAssetId) {
      onDeleteAsset.mutate(selectedAssetId);
      handleCloseModal();
    }
  };

  if (assets.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-10">
        <Text>디지털 자산이 없습니다</Text>
        <Button variant="secondary" className="mt-4" onClick={onCreateAsset}>
          새 디지털 자산 생성
        </Button>
      </div>
    );
  }

  return (
    <>
      <Table>
        <Table.Header>
          <Table.Row>
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
                  <Button variant="secondary" size="small" onClick={() => onViewAsset(asset)}>
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
                    <Button variant="secondary" size="small">
                      복구
                    </Button>
                  )}
                </div>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table>

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
            <Prompt.Action onClick={handleConfirmDelete} disabled={onDeleteAsset.isPending}>
              {onDeleteAsset.isPending ? "삭제 중..." : "삭제"}
            </Prompt.Action>
          </Prompt.Footer>
        </Prompt.Content>
      </Prompt>
    </>
  );
};

export default AssetList;
