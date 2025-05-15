import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DIGITAL_ASSETS_QUERY_KEY, LINK_DIGITAL_ASSET_TO_VARIANT_QUERY_KEY } from "../../constants";
import { sdk } from "../lib/config";

type UnLinkDigitalAssetToVariantDTO = {
  digital_asset_id: string;
  variant_id: string;
};

export const useUnLinkDigitalAssetToVariant = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (unLinkDigitalAssetToVariantDTO: UnLinkDigitalAssetToVariantDTO) => {
      const { digital_asset_id, variant_id } = unLinkDigitalAssetToVariantDTO;

      const response = await sdk.client.fetch(
        `/admin/digital-assets/link-variant?digital_asset_id=${digital_asset_id}&variant_id=${variant_id}`,
        { method: "DELETE" },
      );

      return response;
    },
    onSuccess: (_, { variant_id }) => {
      queryClient.invalidateQueries({
        queryKey: DIGITAL_ASSETS_QUERY_KEY.lists(),
      });

      queryClient.invalidateQueries({
        queryKey: LINK_DIGITAL_ASSET_TO_VARIANT_QUERY_KEY.detail(variant_id),
      });

      toast.success("해당 디지털 자산이 연결 해제되었습니다.");
    },
    onError: (error) => {
      console.error(error.message);

      toast.error(error.message || "디지털 자산 연결 해제중 오류가 발생했습니다.");
    },
  });
};
