import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DIGITAL_ASSETS_QUERY_KEY } from "../../../../../constants";
import { sdk } from "../../../../lib/config";

// 하나 삭제
const useDeleteAssetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetId: string) => {
      await sdk.client.fetch(`/admin/digital-assets/${assetId}`, {
        method: "DELETE",
      });
    },
    onSuccess: (_, assetId) => {
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSETS_QUERY_KEY.all });
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSETS_QUERY_KEY.detail(assetId) });
      toast.success("삭제 처리 되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("삭제 처리 중 오류가 발생했습니다.");
    },
  });
};

// 여러개 삭제
const useDeleteAssetsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetIds: string[]) => {
      const res = await sdk.client.fetch(`/admin/digital-assets/batch_delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: assetIds }),
      });

      return res;
    },

    onSuccess: (_, assetIds) => {
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSETS_QUERY_KEY.all });
      assetIds.forEach((id) => {
        queryClient.invalidateQueries({ queryKey: DIGITAL_ASSETS_QUERY_KEY.detail(id) });
      });
      toast.success("삭제 처리 되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("삭제 처리 중 오류가 발생했습니다.");
    },
  });
};

export { useDeleteAssetMutation, useDeleteAssetsMutation };
