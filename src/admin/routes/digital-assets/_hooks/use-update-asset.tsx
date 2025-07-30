import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DIGITAL_ASSETS_QUERY_KEY } from "../../../constants";
import { useModalStore } from "../../../store/modal-store";

export const useUpdateAssetMutation = () => {
  const queryClient = useQueryClient();
  const { setIsFormModalOpen } = useModalStore();

  return useMutation({
    mutationFn: async ({ id, formData }: { id: string; formData: FormData }) => {
      const response = await fetch(`/admin/digital-assets/${id}`, {
        method: "PATCH",
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`요청 실패: ${response.status}`);
      }

      return response;
    },
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSETS_QUERY_KEY.all });
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSETS_QUERY_KEY.detail(id) });
      toast.success("디지털자산 수정이 완료되었습니다.");
      setIsFormModalOpen(false);
    },
    onError: (error) => {
      console.error(error);
      toast.error("수정 실패", {
        description: `파일 수정 중 오류가 발생했습니다.`,
      });
    },
  });
};
