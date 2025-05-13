export const DIGITAL_ASSETS_QUERY_KEY = {
  all: ["digital-assets"],
  lists: () => [...DIGITAL_ASSETS_QUERY_KEY.all, "list"],
  detail: (id: string) => [...DIGITAL_ASSETS_QUERY_KEY.all, "detail", id],
};
