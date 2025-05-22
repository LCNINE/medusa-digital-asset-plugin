import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DIGITAL_ASSET_LICENSES_QUERY_KEY } from "../../../constants";
import { sdk } from "../../../lib/config";

export const useDeleteLicenseMutation = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (licenseIds: string[]) => {
      await sdk.client.fetch(`/admin/digital-asset-licenses/`, {
        method: "DELETE",
        body: {
          ids: licenseIds,
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSET_LICENSES_QUERY_KEY.all });

      toast.success("삭제 처리 되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("삭제 처리 중 오류가 발생했습니다.");
    },
  });
};
