import { useSuspenseQuery } from "@tanstack/react-query";
import { LicenseResponse } from "../../../../types/license.types";
import { sdk } from "../../../lib/config";
import { DataTableFilteringState, DataTableSortingState } from "@medusajs/ui";
import { DIGITAL_ASSETS_QUERY_KEY } from "../../../constants";

interface IUseDigitalAssetLicenseProps {
  offset: number;
  limit: number;
  search: string;
  statusFilters: string[];
  deletedAtFilters: string[];
  sorting: DataTableSortingState | null;
  filtering: DataTableFilteringState | null;
}

export const useDigitalAssetLicense = ({
  offset,
  limit,
  search,
  statusFilters,
  deletedAtFilters,
  sorting,
  filtering,
}: IUseDigitalAssetLicenseProps) => {
  return useSuspenseQuery({
    queryKey: [
      ...DIGITAL_ASSETS_QUERY_KEY.all,
      filtering?.deleted_at,
      offset,
      limit,
      search,
      statusFilters,
      deletedAtFilters,
      sorting?.id,
      sorting?.desc,
    ],
    queryFn: async () => {
      return await sdk.client.fetch<LicenseResponse>(`/admin/digital-asset-licenses`, {
        query: {
          offset,
          limit,
          search,
          status: statusFilters,
          deleted_at: deletedAtFilters,
          order: sorting ? `${sorting.desc ? "-" : ""}${sorting.id}` : undefined,
        },
      });
    },
  });
};
