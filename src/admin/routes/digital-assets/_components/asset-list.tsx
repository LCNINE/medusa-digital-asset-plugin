import { Button, Table, Text } from "@medusajs/ui";
import { DigitalAsset } from "./types";

type AssetListProps = {
  assets: DigitalAsset[];
  onViewAsset: (asset: DigitalAsset) => void;
  onCreateAsset: () => void;
};

const AssetList = ({ assets, onViewAsset, onCreateAsset }: AssetListProps) => {
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
    <Table>
      <Table.Header>
        <Table.Row>
          <Table.HeaderCell>ID</Table.HeaderCell>
          <Table.HeaderCell>이름</Table.HeaderCell>
          <Table.HeaderCell>타입</Table.HeaderCell>
          <Table.HeaderCell>생성일</Table.HeaderCell>
          <Table.HeaderCell>상품</Table.HeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {assets.map((asset: DigitalAsset) => (
          <Table.Row key={asset.id}>
            <Table.Cell>{asset.id}</Table.Cell>
            <Table.Cell>{asset.name || "-"}</Table.Cell>
            <Table.Cell>{asset.mime_type || "-"}</Table.Cell>
            <Table.Cell>{new Date(asset.created_at).toLocaleDateString()}</Table.Cell>
            <Table.Cell>
              <Button variant="secondary" size="small" onClick={() => onViewAsset(asset)}>
                보기
              </Button>
            </Table.Cell>
          </Table.Row>
        ))}
      </Table.Body>
    </Table>
  );
};

export default AssetList;
