import { DigitalAsset } from "../../.medusa/types/query-entry-points";

interface DigitalAssetPaginatedResponse {
  digital_assets: DigitalAsset[];
  pagination: {
    count: number;
    offset: number;
    limit: number;
  };
}

export { DigitalAssetPaginatedResponse };
