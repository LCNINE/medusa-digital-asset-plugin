import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

// 하나 삭제
const useDeleteAssetMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetId: string) => {
      await fetch(`/admin/digital-assets/${assetId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-assets"] });
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
      const res = await fetch(`/admin/digital-assets/batch_delete`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: assetIds }),
      });

      if (!res.ok) {
        throw new Error("삭제 처리 중 오류가 발생했습니다.");
      }

      return res.json();
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-assets"] });
      toast.success("삭제 처리 되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("삭제 처리 중 오류가 발생했습니다.");
    },
  });
};

export { useDeleteAssetMutation, useDeleteAssetsMutation };
