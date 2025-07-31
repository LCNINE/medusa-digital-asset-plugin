import { toast } from "@medusajs/ui";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DIGITAL_ASSET_LICENSES_QUERY_KEY } from "../../../constants";
import { CreateDigitalAssetLicenseType } from "../../../../api/admin/digital-asset-licenses/validators";

export const useCreateLicense = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (formData: CreateDigitalAssetLicenseType) => {
      const response = await fetch("/admin/digital-asset-licenses", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("라이센스 생성 실패");
      }

      return response;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: DIGITAL_ASSET_LICENSES_QUERY_KEY.all });
      toast.success("라이센스 생성이 완료되었습니다.");
    },
    onError: (error) => {
      console.error(error);
      toast.error("라이센스 생성 실패", {
        description: `라이센스 생성 중 오류가 발생했습니다: ${error}`,
      });
    },
  });
};
