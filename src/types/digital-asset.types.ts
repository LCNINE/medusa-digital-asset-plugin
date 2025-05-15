type DigitalAsset = {
  created_at: string;
  deleted_at: string | null;
  file_id: string;
  file_url: string;
  id: string;
  mime_type: string;
  name: string;
  thumbnail_url: string;
};

interface DigitalAssetPaginatedResponse {
  digital_assets: DigitalAsset[];
  pagination: {
    count: number;
    offset: number;
    limit: number;
  };
}

export { DigitalAsset, DigitalAssetPaginatedResponse };
