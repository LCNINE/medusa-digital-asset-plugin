import { Customer } from ".medusa/types/query-entry-points";

export interface CustomerPaginatedResponse {
  customers: Customer[];
  count: number;
  offset: number;
  limit: number;
}
