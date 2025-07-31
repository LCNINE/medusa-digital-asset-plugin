import { DigitalAssetLicense } from "../../.medusa/types/query-entry-points";

export interface LicenseResponse {
  licenses: DigitalAssetLicense[];
  count: number;
  skip: number;
  take: number;
}

export interface SingleLicenseResponse {
  license: DigitalAssetLicense;
}
