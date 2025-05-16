import { useQuery } from "@tanstack/react-query";
import { sdk } from "../../../lib/config";
import { LicenseResponse } from "../../../../types/license.types";

export const useDigitalAssetLicense = (page: number, limit: number) => {
  const offset = (page - 1) * limit;

  return useQuery({
    queryKey: ["licenses", page, limit],
    queryFn: async () => {
      return await sdk.client.fetch<LicenseResponse>(`/admin/digital-asset-licenses`, {
        query: { limit, offset },
      });
    },
  });
};
