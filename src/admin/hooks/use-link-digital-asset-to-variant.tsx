import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  DIGITAL_ASSETS_QUERY_KEY,
  VARIANT_DIGITAL_ASSETS_QUERY_KEY,
  LINK_DIGITAL_ASSET_TO_VARIANT_QUERY_KEY,
} from "../constants";

type LinkDigitalAssetToVariantDTO = {
  digital_asset_id: string;
  variant_id: string;
};

export const useLinkDigitalAssetToVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (linkDigitalAssetToVariantDTO: LinkDigitalAssetToVariantDTO) => {
      const { digital_asset_id, variant_id } = linkDigitalAssetToVariantDTO;

      const res = await fetch(`/admin/digital-assets/link-variant`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          digital_asset_id,
          variant_id,
        }),
      });

      if (!res.ok) {
        throw new Error((await res.json()).message || "디지털 자산 연결 중 오류가 발생했습니다.");
      }

      await new Promise((resolve) => setTimeout(resolve, 500));

      return res.json();
    },
    onSuccess: (_, { variant_id }) => {
      queryClient.invalidateQueries({
        queryKey: DIGITAL_ASSETS_QUERY_KEY.all,
      });

      queryClient.invalidateQueries({
        queryKey: LINK_DIGITAL_ASSET_TO_VARIANT_QUERY_KEY.detail(variant_id),
      });

      toast.success("디지털 자산이 성공적으로 연결되었습니다.");
    },
    onError: (error) => {
      console.error(error.message);

      toast.error(error.message || "디지털 자산 연결 중 오류가 발생했습니다.");
    },
  });
};
