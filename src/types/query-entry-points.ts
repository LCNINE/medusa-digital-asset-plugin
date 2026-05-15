export type Customer = {
  id: string;
  email?: string | null;
  first_name?: string | null;
  last_name?: string | null;
  [key: string]: unknown;
};

export type DigitalAsset = {
  id: string;
  name: string;
  mime_type: string;
  file_id: string;
  file_url: string;
  thumbnail_url?: string | null;
  created_at?: string | Date;
  updated_at?: string | Date;
  deleted_at?: string | Date | null;
  [key: string]: unknown;
};

export type DigitalAssetLicense = {
  id: string;
  digital_asset_id?: string;
  digital_asset?: DigitalAsset | null;
  customer_id: string;
  customer?: Customer | null;
  order_item_id?: string | null;
  is_exercised: boolean;
  created_at?: string | Date;
  updated_at?: string | Date;
  deleted_at?: string | Date | null;
  [key: string]: unknown;
};

export type ProductVariant = {
  id: string;
  [key: string]: unknown;
};
