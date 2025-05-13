import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useDigitalAsset } from "../../_context";
import { DIGITAL_ASSETS_QUERY_KEY } from "../../../../../_constants";

export const useCreateAssetMutation = () => {
  const queryClient = useQueryClient();
  const { setIsAssetFormModalOpen } = useDigitalAsset();

  return useMutation({
    mutationFn: async (formData: FormData) => {
      const response = await fetch("/admin/digital-assets", {
        method: "POST",
        body: formData,
      });

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSETS_QUERY_KEY.all });
      toast.success("디지털자산 생성이 완료되었습니다.");
      setIsAssetFormModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("업로드 실패", {
        description: `파일 업로드 중 오류가 발생했습니다: ${error}`,
      });
    },
  });
};
