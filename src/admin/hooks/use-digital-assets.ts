import { useInfiniteQuery } from "@tanstack/react-query";
import { DIGITAL_ASSETS_QUERY_KEY } from "../constants";
import { DigitalAssetPaginatedResponse } from "../../types/digital-asset.types";
import { sdk } from "../lib/config";

const PAGE_SIZE = 5;

export const useDigitalAssets = (
  debouncedSearchTerm: string,
  showDropdown: boolean,
  variantId?: string,
) => {
  return useInfiniteQuery({
    queryKey: [DIGITAL_ASSETS_QUERY_KEY.lists(), debouncedSearchTerm, variantId],
    queryFn: async ({ pageParam = 0 }) => {
      const excludeParam = variantId ? `&exclude_variant_id=${variantId}` : "";

      const response = await sdk.client.fetch<DigitalAssetPaginatedResponse>(
        `/admin/digital-assets?limit=${PAGE_SIZE}&offset=${pageParam}&search=${debouncedSearchTerm}${excludeParam}`,
      );
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: DigitalAssetPaginatedResponse) => {
      const { pagination } = lastPage;
      if (pagination.count > pagination.offset + pagination.limit) {
        return pagination.offset + pagination.limit;
      }
      return undefined;
    },
    enabled: !!showDropdown,
    staleTime: 0,
  });
};
