import { defineRouteConfig } from "@medusajs/admin-sdk";
import { HttpTypes } from "@medusajs/framework/types";
import { ChatBubbleLeftRight, Eye } from "@medusajs/icons";
import {
  Badge,
  Button,
  createDataTableColumnHelper,
  createDataTableCommandHelper,
  createDataTableFilterHelper,
  DataTable,
  DataTableFilteringState,
  DataTablePaginationState,
  DataTableRowSelectionState,
  DataTableSortingState,
  toast,
  useDataTable,
} from "@medusajs/ui";
import dayjs from "dayjs";
import { useState } from "react";
import { DigitalAssetLicense } from "../../../../../.medusa/types/query-entry-points";
import { useModalStore } from "../../../../store/modal-store";
import { LicenseResponse } from "../../../../types/license.types";
import { SingleColumnLayout } from "../../../layout/single-column";
import { useDeleteLicenseMutation } from "../_hooks/use-delete-license";

const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).catch((err) => {
    console.error("클립보드 복사 실패:", err);
  });
};

const CopyableCell = ({ value }: { value: string | number | null | undefined }) => {
  if (value === null || value === undefined) {
    return <span>-</span>;
  }

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    const textValue = String(value);
    copyToClipboard(textValue);
    toast(`"${textValue}" 복사되었습니다.`);
  };

  return (
    <span
      onClick={handleClick}
      className="cursor-pointer hover:bg-gray-100 p-1 rounded transition-colors"
      title="클릭하여 복사"
    >
      {value}
    </span>
  );
};

const columnHelper = createDataTableColumnHelper<DigitalAssetLicense>();

const columns = [
  columnHelper.select(),
  columnHelper.accessor("id", {
    header: "ID",
    enableSorting: true,
    sortLabel: "ID",
    cell: ({ getValue }) => <CopyableCell value={getValue()} />,
  }),

  columnHelper.accessor("customer_id", {
    header: "Customer ID",
    enableSorting: true,
    sortLabel: "Customer ID",
    cell: ({ getValue }) => <CopyableCell value={getValue()} />,
  }),

  columnHelper.accessor("order_item_id", {
    header: "Order Item ID",
    enableSorting: true,
    sortLabel: "Order Item ID",
    cell: ({ getValue }) => <CopyableCell value={getValue()} />,
  }),

  columnHelper.accessor("is_exercised", {
    header: "Status",
    cell: ({ getValue }) => {
      const status = getValue();

      return (
        <Badge color={status ? "red" : "green"} size="xsmall">
          {status ? "사용됌" : "사용전"}
        </Badge>
      );
    },
    enableSorting: true,
    sortLabel: "Status",
  }),

  columnHelper.accessor("created_at", {
    header: "생성일",
    enableSorting: true,
    sortLabel: "생성일",
    cell: ({ row, getValue }) => {
      const value = getValue();
      if (!row.original.is_exercised && value) {
        const formattedDate = dayjs(value).format("YYYY-MM-DD");
        return <CopyableCell value={formattedDate} />;
      }
      return "-";
    },
  }),

  columnHelper.accessor("updated_at", {
    header: "사용일",
    enableSorting: true,
    sortLabel: "사용일",
    cell: ({ row, getValue }) => {
      const value = getValue();
      if (row.original.is_exercised && value) {
        const formattedDate = dayjs(value).format("YYYY-MM-DD");
        return <CopyableCell value={formattedDate} />;
      }
      return "-";
    },
  }),

  columnHelper.display({
    id: "actions",
    header: "보기",
    cell: ({ row }) => {
      const { setModalType, setSelectedId } = useModalStore();

      const handleViewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedId(row.id);
        setModalType("detail");
      };

      return (
        <Button variant="secondary" size="small" onClick={handleViewClick}>
          <Eye className="text-ui-fg-subtle" />
          <span className="ml-1">보기</span>
        </Button>
      );
    },
  }),
];

const filterHelper = createDataTableFilterHelper<HttpTypes.AdminProduct>();

const filters = [
  filterHelper.accessor("status", {
    type: "select",
    label: "상태",
    options: [
      {
        label: "사용됌",
        value: "exercised",
      },
      {
        label: "사용전",
        value: "not_exercised",
      },
    ],
  }),
];

const commandHelper = createDataTableCommandHelper();

const useCommands = () => {
  const deleteLicenseMutation = useDeleteLicenseMutation();
  const { setModalType, setSelectedId, setIsFormModalOpen } = useModalStore();

  return [
    commandHelper.command({
      label: "삭제",
      shortcut: "D",
      action: async (selection) => {
        if (confirm("삭제하시겠습니까?")) {
          const productsToDeleteIds = Object.keys(selection);

          deleteLicenseMutation.mutate(productsToDeleteIds);
        }
      },
    }),
    commandHelper.command({
      label: "편집",
      shortcut: "R",
      action: async (selection) => {
        const productsToDeleteIds = Object.keys(selection);
        if (productsToDeleteIds.length > 1) {
          toast.error("편집할 라이센스 하나만 선택해주세요");
          return;
        }
        if (confirm("편집하시겠습니까?")) {
          setSelectedId(productsToDeleteIds[0]);
          setModalType("edit");
          setIsFormModalOpen(true);
        }
      },
    }),
  ];
};

interface ILicenseTableProps {
  licenseData: LicenseResponse;
  isLoading: boolean;
  pagination: DataTablePaginationState;
  setPagination: (pagination: DataTablePaginationState) => void;
  search: string;
  setSearch: (search: string) => void;
  filtering: DataTableFilteringState | null;
  setFiltering: (filtering: DataTableFilteringState) => void;
  sorting: DataTableSortingState | null;
  setSorting: (sorting: DataTableSortingState | null) => void;
}

const LicenseTable = ({
  licenseData,
  isLoading,
  pagination,
  setPagination,
  search,
  setSearch,
  filtering,
  setFiltering,
  sorting,
  setSorting,
}: ILicenseTableProps) => {
  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({});

  const commands = useCommands();

  const table = useDataTable({
    columns,
    data: licenseData?.licenses || [],
    getRowId: (row) => row.id,
    rowCount: licenseData?.count || 0,
    isLoading,
    commands,
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
    filtering: {
      state: filtering || {},
      onFilteringChange: setFiltering,
    },
    filters,
    sorting: {
      state: sorting,
      onSortingChange: setSorting,
    },
  });

  return (
    <SingleColumnLayout>
      <DataTable instance={table}>
        <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
          <div className="flex gap-2">
            <DataTable.FilterMenu tooltip="Filter" />
            <DataTable.SortingMenu tooltip="Sort" />
            <DataTable.Search placeholder="라이센스 ID, 고객 ID 등 검색..." />
          </div>
        </DataTable.Toolbar>
        <DataTable.Table />
        <DataTable.Pagination />

        <DataTable.CommandBar selectedLabel={(count) => `${count} selected`} />
      </DataTable>
    </SingleColumnLayout>
  );
};

export const config = defineRouteConfig({
  label: "Custom",
  icon: ChatBubbleLeftRight,
});

export default LicenseTable;
