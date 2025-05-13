import { toast } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { DIGITAL_ASSETS_QUERY_KEY } from "../../../../../_constants";

export const useGetAssetById = (assetId: string) => {
  return useQuery({
    queryKey: DIGITAL_ASSETS_QUERY_KEY.detail(assetId),
    queryFn: async () => {
      try {
        const response = await fetch(`/admin/digital-assets/${assetId}`);

        if (!response.ok) {
          throw new Error(response.statusText);
        }

        return await response.json();
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
