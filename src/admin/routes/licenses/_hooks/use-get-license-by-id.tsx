import { toast } from "@medusajs/ui";
import { useQuery } from "@tanstack/react-query";
import { useEffect } from "react";
import { DigitalAssetLicense } from "../../../../../.medusa/types/query-entry-points";
import { DIGITAL_ASSET_LICENSES_QUERY_KEY } from "../../../constants";
import { sdk } from "../../../lib/config";

export const useGetLicenseById = (
  selectedId: string,
  includeDeleted: boolean,
  isModalType: boolean,
) => {
  const query = useQuery<DigitalAssetLicense>({
    queryKey: DIGITAL_ASSET_LICENSES_QUERY_KEY.detail(selectedId),
    queryFn: async () => {
      const res = await sdk.client.fetch<DigitalAssetLicense>(
        `/admin/digital-asset-licenses/${selectedId}`,
        {
          query: {
            include_deleted: includeDeleted,
          },
        },
      );

      if (!res || Object.keys(res).length === 0) {
        throw new Error("Empty response from server");
      }

      return res;
    },

    enabled: !!selectedId && !!isModalType,
  });

  useEffect(() => {
    if (query.error) {
      console.error("query.error:", query.error);
      toast.error("데이터 조회 실패", {
        description: "라이센스 정보를 불러오는 중 오류가 발생했습니다",
      });
    }
  }, [query.error]);

  return query;
};
