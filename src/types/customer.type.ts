import { Customer } from ".medusa/types/query-entry-points";

interface CustomerPaginatedResponse {
  customers: Customer[];
  count: number;
  offset: number;
  limit: number;
}

export { CustomerPaginatedResponse };
