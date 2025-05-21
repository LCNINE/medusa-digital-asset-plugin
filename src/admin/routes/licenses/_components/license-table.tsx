import { defineRouteConfig } from "@medusajs/admin-sdk";
import { HttpTypes } from "@medusajs/framework/types";
import { ChatBubbleLeftRight } from "@medusajs/icons";
import {
  Badge,
  createDataTableColumnHelper,
  createDataTableCommandHelper,
  createDataTableFilterHelper,
  DataTable,
  DataTableFilteringState,
  DataTablePaginationState,
  DataTableRowSelectionState,
  DataTableSortingState,
  Heading,
  useDataTable,
} from "@medusajs/ui";
import dayjs from "dayjs";
import { useState } from "react";
import { DigitalAssetLicense } from "../../../../../.medusa/types/query-entry-points";
import { useModalStore } from "../../../../store/modal-store";
import { LicenseResponse } from "../../../../types/license.types";
import { SingleColumnLayout } from "../../../layout/single-column";

const columnHelper = createDataTableColumnHelper<DigitalAssetLicense>();

const columns = [
  columnHelper.select(),
  columnHelper.accessor("id", {
    header: "ID",
    enableSorting: true,
    sortLabel: "ID",
  }),

  columnHelper.accessor("customer_id", {
    header: "Customer ID",
    enableSorting: true,
    sortLabel: "Customer ID",
  }),

  columnHelper.accessor("order_item_id", {
    header: "Order Item ID",
    enableSorting: true,
    sortLabel: "Order Item ID",
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
    header: "생성 및 사용일",
    enableSorting: true,
    cell: ({ getValue }) => dayjs(getValue()).format("YYYY-MM-DD"),
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
  return [
    commandHelper.command({
      label: "삭제",
      shortcut: "D",
      action: async (selection) => {
        const productsToDeleteIds = Object.keys(selection);
        console.log("productsToDeleteIds:", productsToDeleteIds);
        if (confirm("삭제하시겠습니까?")) {
          console.log("삭제 진행");
        }
      },
    }),
    commandHelper.command({
      label: "편집",
      shortcut: "R",
      action: async (selection) => {
        const productsToDeleteIds = Object.keys(selection);
        console.log("productsToDeleteIds:", productsToDeleteIds);
        if (confirm("편집하시겠습니까?")) {
          console.log("편집 진행");
        }
      },
    }),
  ];
};

interface ILicenseTableProps {
  licenseData: LicenseResponse;
  isLoading: boolean;
  onRevokeClick: (licenseId: string) => void;
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
  onRevokeClick,
  pagination,
  setPagination,
  search,
  setSearch,
  filtering,
  setFiltering,
  sorting,
  setSorting,
}: ILicenseTableProps) => {
  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({}); // selectbox 체크된것들

  const { modalType, setModalType, selectedId, setSelectedId, setEntityType } = useModalStore();

  const commands = useCommands();

  const table = useDataTable({
    columns,
    data: licenseData?.licenses || [],
    getRowId: (row) => row.id,
    rowCount: licenseData?.pagination.count || 0,
    isLoading,
    commands,
    rowSelection: {
      state: rowSelection,
      onRowSelectionChange: setRowSelection,
    },
    onRowClick: (event, row) => {
      setSelectedId(row.id);
      setModalType("detail");
      setEntityType("digital-asset-license");
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
      // Pass the pagination state and updater to the table instance
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
            <DataTable.Search placeholder="Search..." />
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
