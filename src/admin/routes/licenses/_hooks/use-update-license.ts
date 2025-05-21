import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DIGITAL_ASSET_LICENSES_QUERY_KEY } from "../../../constants";

export const useUpdateLicense = () => {
  const queryClient = useQueryClient();

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
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSET_LICENSES_QUERY_KEY.all });
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSET_LICENSES_QUERY_KEY.detail(id) });
      toast.success("라이센스 수정이 완료되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("수정 실패", {
        description: `라이센스 수정 중 오류가 발생했습니다.`,
      });
    },
  });
};
