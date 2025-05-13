import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const useRestoreAssetsMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (assetIds: string[]) => {
      const res = await fetch(`/admin/digital-assets/restore`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ ids: assetIds }),
      });

      if (!res.ok) {
        throw new Error("복구 처리 중 오류가 발생했습니다.");
      }

      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["digital-assets"] });
      toast.success("복구 처리 되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("복구 처리 중 오류가 발생했습니다.");
    },
  });
};
