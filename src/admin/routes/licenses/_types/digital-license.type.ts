import { DigitalAssetLicense } from "../../../../../.medusa/types/query-entry-points";

export type LicenseWithFields = DigitalAssetLicense & {
  digital_asset_id: string;
};
