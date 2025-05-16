import { QueryClient, useMutation } from "@tanstack/react-query";

export const useRevokeLicense = (queryClient: QueryClient) => {
  return useMutation({
    mutationFn: async (licenseId: string) => {
      await fetch(`/admin/digital-asset-licenses/${licenseId}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["licenses"] });
    },
  });
};
