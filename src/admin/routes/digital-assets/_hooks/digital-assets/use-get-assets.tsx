import { DataTableSortingState, toast } from "@medusajs/ui";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useFilteringStore } from "../../../../../store/filtering-store";
import { DigitalAsset } from "../../../../../../.medusa/types/query-entry-points";
import { DIGITAL_ASSETS_QUERY_KEY } from "../../../../constants";
import { sdk } from "../../../../lib/config";

interface IUseGetAssetsProps {
  offset: number;
  limit: number;
  search: string;
  statusFilters: string[];
  deletedAtFilters: string[];
  sorting: DataTableSortingState | null;
}

export const useGetAssets = ({
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
        return await sdk.client.fetch(`/admin/digital-assets`, {
          query: {
            offset,
            limit,
            search,
            status: statusFilters,
            deleted_at: deletedAtFilters,
            order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
          },
        });
      } catch (error) {
        toast.error("디지털 자산을 불러오던 중 에러가 발생했습니다.", {
          id: "digital-asset-error",
        });
        throw error;
      }
    },
  });

  return query;
};
