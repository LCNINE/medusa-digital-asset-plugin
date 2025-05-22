import { Spinner } from "@medusajs/icons";
import { Container, Text, Toaster } from "@medusajs/ui";
import { Suspense } from "react";
import { useModalStore } from "../../../store/modal-store";
import { TableHeader } from "../../components/table-header";
import DeferredComponent from "../../layout/deferred-component";
import { AssetFormModal } from "./_components";
import AssetListTable from "./_components/asset-list-table";

const DigitalAssetManager = () => {
  const { setIsFormModalOpen } = useModalStore();

  return (
    <Container>
      <Toaster />

      <TableHeader
        title="Digital Assets"
        subtitle="관리자는 이 페이지에서 디지털 자산을 관리할 수 있습니다."
        actions={[
          {
            type: "button",
            props: {
              children: <>Create</>,
              onClick: () => {
                setIsFormModalOpen(true);
              },
            },
          },
        ]}
      />

      <Suspense
        fallback={
          <DeferredComponent>
            <div className="flex items-center gap-2 px-4 py-2 rounded-md ">
              <Spinner className="animate-spin text-ui-fg-muted" />
              <Text className="text-ui-fg-subtle">데이터 로딩 중...</Text>
            </div>
          </DeferredComponent>
        }
      >
        <AssetListTable />
      </Suspense>

      <AssetFormModal />
    </Container>
  );
};

export default DigitalAssetManager;
