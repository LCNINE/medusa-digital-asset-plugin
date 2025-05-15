import { toast } from "@medusajs/ui";
import { useSuspenseQuery } from "@tanstack/react-query";
import { LINK_DIGITAL_ASSET_TO_VARIANT_QUERY_KEY } from "../../constants";
import { DigitalAsset } from "../../types/digital-asset.types";
import { sdk } from "../lib/config";

export const useDigitalAssetLinkedVariant = (variant_id: string) => {
  return useSuspenseQuery({
    queryKey: LINK_DIGITAL_ASSET_TO_VARIANT_QUERY_KEY.detail(variant_id),
    queryFn: async () => {
      try {
        const res = await sdk.client.fetch<DigitalAsset[]>(
          `/admin/digital-assets/link-variant/${variant_id}`,
        );

        return res;
      } catch (error: any) {
        console.error(error);
        toast.error(error.message || "디지털 자산 연결 조회 중 오류가 발생했습니다.", {
          id: "linked-variant-error",
        });
      }
    },
  });
};
