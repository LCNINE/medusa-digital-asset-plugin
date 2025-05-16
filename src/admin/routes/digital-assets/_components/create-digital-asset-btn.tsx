import { Button } from "@medusajs/ui";
import { useDigitalAssetStore } from "../../../../store/digital-asset";

const CreateDigitalAssetBtn = () => {
  const { setIsAssetFormModalOpen } = useDigitalAssetStore();

  return <Button onClick={() => setIsAssetFormModalOpen(true)}>디지털 자산 생성</Button>;
};

export default CreateDigitalAssetBtn;
