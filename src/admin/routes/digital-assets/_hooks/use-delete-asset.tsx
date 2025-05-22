import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DIGITAL_ASSETS_QUERY_KEY } from "../../../constants";
import { sdk } from "../../../lib/config";

export const useDeleteAssetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetIds: string[]) => {
      await sdk.client.fetch(`/admin/digital-assets`, {
        method: "DELETE",
        body: {
          ids: assetIds,
        },
      });
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
