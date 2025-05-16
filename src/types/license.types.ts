import { DigitalAssetLicense } from "../../.medusa/types/query-entry-points";

interface LicenseResponse {
  licenses: DigitalAssetLicense[];
  pagination: {
    count: number;
    skip: number;
    take: number;
  };
}

export type { LicenseResponse };
