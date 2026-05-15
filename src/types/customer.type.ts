import type { Customer } from "./query-entry-points";

export interface CustomerPaginatedResponse {
  customers: Customer[];
  count: number;
  offset: number;
  limit: number;
}
