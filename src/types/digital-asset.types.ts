import { DigitalAsset } from "../../.medusa/types/query-entry-points";

export interface DigitalAssetPaginatedResponse {
  digital_assets: DigitalAsset[];
  count: number;
  offset: number;
  limit: number;
}
