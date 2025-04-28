export type DigitalAssetInputBody = {
  name: string;
  asset: {
    base64Content: string;
    mimeType: string;
  };
  thumbnail?: {
    base64Content: string;
    mimeType: string;
  };
};

export type UpdateDigitalAssetInputBody = {
  fileId: string;
  type: "digital-asset" | "digital-asset-thumbnail";
  mimeType: string;
  base64Content: string;
};
