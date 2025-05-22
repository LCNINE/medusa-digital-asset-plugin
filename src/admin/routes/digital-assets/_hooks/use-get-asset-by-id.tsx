import { toast } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { DigitalAsset } from "../../../../types/digital-asset.types";
import { DIGITAL_ASSETS_QUERY_KEY } from "../../../constants";
import { sdk } from "../../../lib/config";

export const useGetAssetById = (assetId: string, includeDeleted: boolean) => {
  const query = useQuery<DigitalAsset>({
    queryKey: DIGITAL_ASSETS_QUERY_KEY.detail(assetId),
    queryFn: async () => {
      const res = await sdk.client.fetch<DigitalAsset>(`/admin/digital-assets/${assetId}`, {
        query: {
          include_deleted: includeDeleted,
        },
      });

      if (!res || Object.keys(res).length === 0) {
        throw new Error("Empty response from server");
      }

      return res;
    },

    enabled: !!assetId,
  });

  useEffect(() => {
    if (query.error) {
      console.error("query.error:", query.error);
      toast.error("데이터 조회 실패", {
        description: "디지털 자산 정보를 불러오는 중 오류가 발생했습니다",
      });
    }
  }, [query.error]);

  return query;
};
