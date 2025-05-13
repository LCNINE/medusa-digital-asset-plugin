import { Button } from "@medusajs/ui";
import { useDigitalAsset } from "../_context";

const CreateDigitalAssetBtn = () => {
  const { setIsAssetFormModalOpen } = useDigitalAsset();

  return <Button onClick={() => setIsAssetFormModalOpen(true)}>디지털 자산 생성</Button>;
};

export default CreateDigitalAssetBtn;
