import { toast } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { DIGITAL_ASSETS_QUERY_KEY } from "../../../../../constants";
import { sdk } from "../../../../lib/config";
import { DigitalAsset } from "../../../../../types/digital-asset.types";

export const useGetAssetById = (assetId: string) => {
  return useQuery<DigitalAsset>({
    queryKey: DIGITAL_ASSETS_QUERY_KEY.detail(assetId),
    queryFn: async () => {
      try {
        return await sdk.client.fetch(`/admin/digital-assets/${assetId}`);
      } catch (error) {
        toast.error("데이터 조회 실패", {
          description: `데이터 조회 중 오류가 발생했습니다`,
        });
        throw error;
      }
    },
    enabled: !!assetId,
  });
};
