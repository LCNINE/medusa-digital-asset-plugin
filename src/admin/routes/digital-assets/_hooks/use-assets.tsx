import { DataTableSortingState, toast } from "@medusajs/ui";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useFilteringStore } from "../../../../store/filtering-store";
import { DigitalAsset } from "../../../../../.medusa/types/query-entry-points";
import { DIGITAL_ASSETS_QUERY_KEY } from "../../../constants";
import { sdk } from "../../../lib/config";

interface IUseGetAssetsProps {
  offset: number;
  limit: number;
  search: string;
  statusFilters: string[];
  deletedAtFilters: string[];
  sorting: DataTableSortingState | null;
}

export const useAssets = ({
  offset,
  limit,
  search,
  statusFilters,
  deletedAtFilters,
  sorting,
}: IUseGetAssetsProps) => {
  const { filtering } = useFilteringStore();

  const query = useSuspenseQuery<{
    digital_assets: DigitalAsset[];
    pagination: {
      count: number;
      offset: number;
      limit: number;
    };
  }>({
    queryKey: [
      ...DIGITAL_ASSETS_QUERY_KEY.all,
      filtering.deleted_at,
      offset,
      limit,
      search,
      statusFilters,
      deletedAtFilters,
      sorting?.id,
      sorting?.desc,
    ],
    queryFn: async () => {
      try {
        let deletedAtValue: string | undefined = undefined;

        if (deletedAtFilters.includes("true") && deletedAtFilters.includes("false")) {
          deletedAtValue = "all";
        }
        // 삭제된 항목만 선택된 경우
        else if (deletedAtFilters.includes("true")) {
          deletedAtValue = "true";
        }
        // 활성 항목만 선택된 경우
        else if (deletedAtFilters.includes("false")) {
          deletedAtValue = "false";
        }
        // 아무것도 선택되지 않은 경우
        else {
          deletedAtValue = "false";
        }

        return await sdk.client.fetch(`/admin/digital-assets`, {
          query: {
            offset,
            limit,
            search,
            status: statusFilters,
            deleted_at: deletedAtValue,
            order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
          },
        });
      } catch (error) {
        console.error("error:", error);
        toast.error("디지털 자산을 불러오던 중 에러가 발생했습니다.", {
          id: "digital-asset-error",
        });
        throw error;
      }
    },
  });

  return query;
};
