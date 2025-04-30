import { defineWidgetConfig } from "@medusajs/admin-sdk";
import { Container, Heading, Text, Badge } from "@medusajs/ui";
import { DetailWidgetProps } from "@medusajs/framework/types";
import { useQuery } from "@tanstack/react-query";

type DigitalAsset = {
  id: string;
  name?: string;
  type?: string;
};

const DigitalAssetDetailWidget = ({ data: productData }: DetailWidgetProps<any>) => {
  const { data, isLoading } = useQuery({
    queryKey: ["product-digital-assets", productData.id],
    queryFn: async () => {
      try {
        const response = await fetch(`/admin/digital-assets/${productData.id}`);
        console.log(response);
        return await response.json();
      } catch (error) {
        console.error("디지털 자산 정보를 가져오는 중 오류 발생:", error);
        return { digital_assets: [] };
      }
    },
    enabled: !!productData.id,
  });

  return (
    <Container className="p-4">
      <div className="mb-4">
        <Heading level="h2">디지털 콘텐츠</Heading>
      </div>

      {isLoading ? (
        <Text>로딩 중...</Text>
      ) : data?.digital_assets?.length > 0 ? (
        <div className="space-y-4">
          {data.digital_assets.map((asset: DigitalAsset) => (
            <div key={asset.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <Text className="font-medium">{asset.name || "이름 없음"}</Text>
                <Badge>{asset.type || "타입 없음"}</Badge>
              </div>
              <Text className="text-sm text-gray-500 mt-2">ID: {asset.id}</Text>
            </div>
          ))}
        </div>
      ) : (
        <Text className="text-gray-500">이 상품에 연결된 디지털 자산이 없습니다.</Text>
      )}
    </Container>
  );
};

export const config = defineWidgetConfig({
  zone: "product.details.after",
});

export default DigitalAssetDetailWidget;
