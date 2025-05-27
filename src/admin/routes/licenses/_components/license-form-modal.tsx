import { Button, FocusModal, Text } from "@medusajs/ui";
import { useEffect, useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
import {
  Customer,
  DigitalAsset,
  DigitalAssetLicense,
} from "../../../../../.medusa/types/query-entry-points";
import { CreateDigitalAssetLicenseType } from "../../../../api/admin/digital-asset-licenses/validators";
import { useModalStore } from "../../../../store/modal-store";
import { CustomerSelector } from "../../../components/customer-selector";
import { DigitalAssetSelector } from "../../../components/digital-asset-selector";
import { useCreateLicense } from "../_hooks/use-create-license";
import { useUpdateLicense } from "../_hooks/use-update-license";

interface ILicenseFormModalProps {
  licenseData: DigitalAssetLicense | undefined;
  isLoading: boolean;
  type: "create" | "edit";
}

const LicenseFormModal = ({ licenseData, isLoading, type }: ILicenseFormModalProps) => {
  const [selectedAsset, setSelectedAsset] = useState<DigitalAsset | null>(null);
  const [selectedCustomer, setSelectedCustomer] = useState<Customer | null>(null);
  const [selectedCustomerId, setSelectedCustomerId] = useState<string | null>(null);

  const { isFormModalOpen, setIsFormModalOpen, selectedId, setSelectedId } = useModalStore();

  const createLicenseMutation = useCreateLicense();
  const updateLicenseMutation = useUpdateLicense();

  const form = useForm<CreateDigitalAssetLicenseType>({
    defaultValues: {
      digital_asset_id: "",
      customer_id: "",
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedAsset?.id || !selectedCustomer?.id) {
      return alert("라이센스 생성에 필요한 정보를 선택해주세요.");
    }

    const formData: CreateDigitalAssetLicenseType & { is_exercised?: boolean } = {
      digital_asset_id: selectedAsset.id,
      customer_id: selectedCustomer.id,
    };

    if (licenseData?.id) {
      formData.is_exercised = false;

      updateLicenseMutation.mutate(
        { id: licenseData.id, formData },
        {
          onSuccess: () => {
            setIsFormModalOpen(false);
          },
        },
      );
    } else {
      createLicenseMutation.mutate(formData, {
        onSuccess: () => {
          setIsFormModalOpen(false);
        },
      });
    }
  };

  const handleModalClose = () => {
    setIsFormModalOpen(false);
    setSelectedId(null);
    setSelectedCustomer(null);
    form.reset();
  };

  useEffect(() => {
    if (licenseData) {
      form.reset({
        digital_asset_id: licenseData.digital_asset?.id,
        customer_id: licenseData.customer?.id,
      });
    }
  }, [licenseData]);

  useEffect(() => {
    if (selectedAsset) {
      form.setValue("digital_asset_id", selectedAsset.id);
    }

    if (selectedCustomer) {
      form.setValue("customer_id", selectedCustomer.id);
    }
  }, [selectedAsset, selectedCustomer]);

  useEffect(() => {
    if (licenseData) {
      setSelectedCustomerId(licenseData.customer_id);
      setSelectedCustomer(licenseData.customer);
      setSelectedAsset(licenseData.digital_asset);
    }
  }, [licenseData]);

  const modalTitle = type === "create" ? "새 라이센스 생성" : "라이센스 편집";

  return (
    <FormProvider {...form}>
      <FocusModal open={isFormModalOpen} onOpenChange={handleModalClose}>
        <FocusModal.Content aria-describedby={undefined}>
          <FocusModal.Header>
            <FocusModal.Title>{modalTitle}</FocusModal.Title>
          </FocusModal.Header>

          <FocusModal.Body className="py-8 px-4">
            {isLoading ? (
              <div className="w-full flex flex-col items-center justify-center py-16">
                <div className="animate-spin rounded-full h-12 w-12 border-2 border-ui-border-base border-t-ui-fg-base"></div>
                <Text className="text-ui-fg-subtle mt-4">로딩 중...</Text>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-8 max-w-2xl mx-auto">
                <CustomerSelector
                  selectedCustomerId={selectedCustomerId}
                  setSelectedCustomerId={setSelectedCustomerId}
                  selectedCustomer={selectedCustomer}
                  setSelectedCustomer={setSelectedCustomer}
                />

                <DigitalAssetSelector
                  selectedAssetId={selectedId}
                  setSelectedAssetId={setSelectedId}
                  selectedAsset={selectedAsset}
                  setSelectedAsset={setSelectedAsset}
                  isLinking={false}
                />

                <div className="flex justify-end gap-3 pt-2">
                  <Button type="button" variant="secondary" onClick={handleModalClose}>
                    취소
                  </Button>
                  <Button
                    type="submit"
                    variant="primary"
                    disabled={updateLicenseMutation.isPending || !selectedCustomer}
                  >
                    {licenseData
                      ? updateLicenseMutation.isPending
                        ? "업데이트 중..."
                        : "업데이트"
                      : createLicenseMutation.isPending
                        ? "생성 중..."
                        : "생성"}
                  </Button>
                </div>
              </form>
            )}
          </FocusModal.Body>
        </FocusModal.Content>
      </FocusModal>
    </FormProvider>
  );
};

export default LicenseFormModal;
