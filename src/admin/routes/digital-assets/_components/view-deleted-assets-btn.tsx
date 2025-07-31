import { Checkbox, Label } from "@medusajs/ui";
import { useDigitalAssetStore } from "../../../store/digital-asset-store";

interface IProps {
  includeDeleted: boolean;
  setIncludeDeleted: (includeDeleted: boolean) => void;
  setOffset: (offset: number) => void;
}

const ViewDeletedAssetsBtn = ({ includeDeleted, setIncludeDeleted, setOffset }: IProps) => {
  const { setSelectedAssets } = useDigitalAssetStore();

  return (
    <div className="flex items-center gap-x-2">
      <Checkbox
        id="include-deleted"
        checked={includeDeleted}
        onCheckedChange={(checked) => {
          setIncludeDeleted(checked === true ? true : false);
          setOffset(0);
          setSelectedAssets([]);
        }}
      />
      <Label htmlFor="include-deleted">삭제된 자산 보기</Label>
    </div>
  );
};

export default ViewDeletedAssetsBtn;
