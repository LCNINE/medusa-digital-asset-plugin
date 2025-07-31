import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateDigitalAssetLicenseType } from "../../../../api/admin/digital-asset-licenses/validators";
import { DIGITAL_ASSET_LICENSES_QUERY_KEY } from "../../../constants";

export const useUpdateLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      id,
      formData,
    }: {
      id: string;
      formData: CreateDigitalAssetLicenseType;
    }) => {
      const response = await fetch(`/admin/digital-asset-licenses?license_id=${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error(`요청 실패: ${response.status}`);
      }

      return response;
    },
    onSuccess: (_) => {
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSET_LICENSES_QUERY_KEY.all });
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
