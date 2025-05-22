import { DigitalAsset } from "../../.medusa/types/query-entry-points";

interface DigitalAssetPaginatedResponse {
  digital_assets: DigitalAsset[];
  count: number;
  offset: number;
  limit: number;
}

export { DigitalAssetPaginatedResponse };
