export const DIGITAL_ASSETS_QUERY_KEY = {
  all: ["digital-assets"],
  lists: () => [...DIGITAL_ASSETS_QUERY_KEY.all, "list"],
  detail: (id: string) => [...DIGITAL_ASSETS_QUERY_KEY.all, "detail", id],
};

export const VARIANT_DIGITAL_ASSETS_QUERY_KEY = {
  all: ["variant-digital-assets"],
  lists: () => [...VARIANT_DIGITAL_ASSETS_QUERY_KEY.all, "list"],
  detail: (id: string) => [...VARIANT_DIGITAL_ASSETS_QUERY_KEY.all, "detail", id],
};

export const LINK_DIGITAL_ASSET_TO_VARIANT_QUERY_KEY = {
  all: ["link-digital-asset-to-variant"],
  detail: (variant_id: string) => [
    ...LINK_DIGITAL_ASSET_TO_VARIANT_QUERY_KEY.all,
    "detail",
    variant_id,
  ],
};

export const DIGITAL_ASSET_LICENSES_QUERY_KEY = {
  all: ["digital-asset-licenses"],
  lists: () => [...DIGITAL_ASSET_LICENSES_QUERY_KEY.all, "list"],
  detail: (id: string) => [...DIGITAL_ASSET_LICENSES_QUERY_KEY.all, "detail", id],
};
