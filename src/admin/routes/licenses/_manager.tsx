import { Container, DataTablePaginationState, DataTableSortingState } from "@medusajs/ui";
import { useMemo, useState } from "react";
import { useFilteringStore } from "../../store/filtering-store";
import { useModalStore } from "../../store/modal-store";
import { TableHeader } from "../../components/table-header";
import LicenseDetailsModal from "./_components/license-details-modal";
import LicenseFormModal from "./_components/license-form-modal";
import LicenseTable from "./_components/license-table";
import { useDigitalAssetLicense } from "./_hooks/use-digital-asset-licenses";
import { useGetLicenseById } from "./_hooks/use-get-license-by-id";

const limit = 10;

export const LicenseManager = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<DataTableSortingState | null>(null);

  const { modalType, setModalType, selectedId, setIsFormModalOpen } = useModalStore();
  const { filtering, setFiltering } = useFilteringStore();

  const getLicenseData = useGetLicenseById(
    selectedId as string,
    filtering.deleted_at as boolean,
    modalType === "detail" || modalType === "edit",
  );

  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const statusFilters = useMemo(() => {
    return (filtering?.status || []) as string[];
  }, [filtering]);

  const deletedAtFilters = useMemo(() => {
    return (filtering?.deleted_at || []) as string[];
  }, [filtering]);

  const { data, isPending } = useDigitalAssetLicense({
    offset,
    limit,
    search,
    statusFilters,
    deletedAtFilters,
    sorting,
    filtering,
  });

  return (
    <Container>
      <TableHeader
        title="Licenses"
        subtitle="관리자는 이 페이지에서 라이센스를 관리할 수 있습니다."
        actions={[
          {
            type: "button",
            props: {
              children: <>Create</>,
              onClick: () => {
                setIsFormModalOpen(true);
                setModalType("create");
              },
            },
          },
        ]}
      />

      <LicenseTable
        licenseData={data}
        isLoading={isPending}
        pagination={pagination}
        setPagination={setPagination}
        search={search}
        setSearch={setSearch}
        filtering={filtering}
        setFiltering={setFiltering}
        sorting={sorting}
        setSorting={setSorting}
      />

      <LicenseDetailsModal
        license={getLicenseData.data}
        isLoading={getLicenseData.isPending}
        isOpen={modalType === "detail"}
        onClose={() => setModalType(null)}
      />

      <LicenseFormModal
        licenseData={getLicenseData.data}
        isLoading={modalType === "create" ? isPending : getLicenseData.isPending}
        type={modalType === "create" ? "create" : "edit"}
      />
    </Container>
  );
};
