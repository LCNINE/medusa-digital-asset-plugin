import { useInfiniteQuery } from "@tanstack/react-query";
import { CustomerPaginatedResponse } from "../../types/customer.type";
import { CUSTOMERS_QUERY_KEY } from "../constants";
import { sdk } from "../lib/config";

const PAGE_SIZE = 5;

export const useCustomers = ({
  debouncedSearchTerm,
  showDropdown,
}: {
  debouncedSearchTerm: string;
  showDropdown: boolean;
}) => {
  return useInfiniteQuery({
    queryKey: [CUSTOMERS_QUERY_KEY.lists(), debouncedSearchTerm],
    queryFn: async ({ pageParam = 0 }) => {
      // ID로 검색할 때는 정확한 매칭을 위해 별도의 파라미터 사용
      const isIdSearch = debouncedSearchTerm.startsWith("cus_");
      const searchParam = isIdSearch ? `&id=${debouncedSearchTerm}` : `&q=${debouncedSearchTerm}`;

      const response = await sdk.client.fetch<CustomerPaginatedResponse>(
        `/admin/customers?limit=${PAGE_SIZE}&offset=${pageParam}${searchParam}`,
      );
      return response;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage: CustomerPaginatedResponse) => {
      const hasMore = lastPage.count > lastPage.offset + lastPage.limit;
      return hasMore ? lastPage.offset + lastPage.limit : undefined;
    },
    enabled: !!showDropdown,
    staleTime: 0,
  });
};
