import { Eye } from "@medusajs/icons";
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
import { DigitalAsset } from "../../../../../.medusa/types/query-entry-points";
import { useModalStore } from "../../../../store/modal-store";
import { SingleColumnLayout } from "../../../layout/single-column";
import { useAssets } from "../_hooks/use-assets";
import { useDeleteAssetMutation } from "../_hooks/use-delete-asset";
import { useRestoreAssetsMutation } from "../_hooks/use-restore-asset";

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

const columnHelper = createDataTableColumnHelper<DigitalAsset>();

const columns = [
  columnHelper.select(),
  columnHelper.accessor("id", {
    header: "ID",
    enableSorting: true,
    cell: ({ getValue }) => <CopyableCell value={getValue()} />,
  }),
  columnHelper.accessor("name", {
    header: "이름",
    enableSorting: true,
    sortLabel: "이름",
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A",
    cell: ({ getValue }) => <CopyableCell value={getValue()} />,
  }),
  columnHelper.accessor("mime_type", {
    header: "파일 유형",
    cell: ({ getValue }) => <CopyableCell value={getValue()} />,
  }),
  columnHelper.accessor("created_at", {
    header: "생성일",
    enableSorting: true,
    cell: ({ row, getValue }) => {
      const value = getValue();
      if (!row.original.deleted_at && value) {
        const formattedDate = dayjs(value).format("YYYY-MM-DD");
        return <CopyableCell value={formattedDate} />;
      }
      return "-";
    },
  }),
  columnHelper.accessor("deleted_at", {
    header: "삭제일",
    enableSorting: true,
    cell: ({ getValue }) => {
      const value = getValue();
      if (value) {
        const formattedDate = dayjs(value).format("YYYY-MM-DD");
        return <CopyableCell value={formattedDate} />;
      }
      return "-";
    },
  }),
  columnHelper.accessor("deleted_at", {
    id: "status",
    header: "상태",
    cell: ({ getValue }) => {
      const isDeleted = !!getValue();

      return (
        <Badge color={isDeleted ? "red" : "green"} size="xsmall">
          {isDeleted ? "삭제됨" : "활성"}
        </Badge>
      );
    },
  }),
  columnHelper.display({
    id: "actions",
    header: "보기",
    cell: ({ row }) => {
      const { setModalType, setSelectedId, setIsFormModalOpen } = useModalStore();

      const handleViewClick = (e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedId(row.original.id);
        setIsFormModalOpen(true);
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

const filterHelper = createDataTableFilterHelper<DigitalAsset>();

const filters = [
  filterHelper.accessor("mime_type", {
    type: "select",
    label: "파일 유형",
    options: [
      {
        label: "이미지",
        value: "image/",
      },
      {
        label: "비디오",
        value: "video/",
      },
      {
        label: "오디오",
        value: "audio/",
      },
      {
        label: "PDF",
        value: "application/pdf",
      },
    ],
  }),
  filterHelper.accessor("deleted_at", {
    type: "select",
    label: "상태",
    options: [
      {
        label: "삭제됨",
        value: "true",
      },
      {
        label: "활성",
        value: "false",
      },
    ],
  }),
];

const commandHelper = createDataTableCommandHelper();

const useCommands = () => {
  const deleteAssets = useDeleteAssetMutation();
  const restoreAssets = useRestoreAssetsMutation();

  return [
    commandHelper.command({
      label: "삭제",
      shortcut: "D",
      action: async (selection) => {
        if (confirm("선택한 항목을 삭제하시겠습니까?")) {
          const assetsToDeleteIds = Object.keys(selection);
          deleteAssets.mutate(assetsToDeleteIds);
        }
      },
    }),
    commandHelper.command({
      label: "복구",
      shortcut: "R",
      action: async (selection) => {
        if (confirm("선택한 항목을 복구하시겠습니까?")) {
          const assetsToRestoreIds = Object.keys(selection);

          restoreAssets.mutate(assetsToRestoreIds, {
            onSuccess: () => {
              toast.success("복구 처리 되었습니다.");
            },
            onError: () => {
              toast.error("복구 처리 중 오류가 발생했습니다.");
            },
          });
        }
      },
    }),
    commandHelper.command({
      label: "편집",
      shortcut: "E",
      action: async (selection) => {
        const assetsIds = Object.keys(selection);
        if (assetsIds.length > 1) {
          toast.error("편집할 자산 하나만 선택해주세요");
          return;
        }

        const { setSelectedId, setIsFormModalOpen } = useModalStore();
        setSelectedId(assetsIds[0]);
        setIsFormModalOpen(true);
      },
    }),
  ];
};

const AssetListTable = () => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: 20,
    pageIndex: 0,
  });
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<DataTableSortingState | null>(null);
  const [filtering, setFiltering] = useState<DataTableFilteringState>({});
  const [rowSelection, setRowSelection] = useState<DataTableRowSelectionState>({});

  const offset = pagination.pageIndex * pagination.pageSize;

  const statusFilters = (filtering.mime_type || []) as string[];
  const deletedAtFilters = (filtering.deleted_at || []) as string[];

  const { data, isLoading } = useAssets({
    offset,
    limit: pagination.pageSize,
    search,
    statusFilters,
    deletedAtFilters,
    sorting,
  });

  const commands = useCommands();

  const table = useDataTable({
    columns,
    data: data?.digital_assets || [],
    getRowId: (row) => row.id,
    rowCount: data?.count || 0,
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
            <DataTable.FilterMenu tooltip="필터" />
            <DataTable.SortingMenu tooltip="정렬" />
            <DataTable.Search placeholder="디지털 자산 이름, ID 등 검색..." />
          </div>
        </DataTable.Toolbar>

        {data?.digital_assets?.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 bg-white rounded-md">
            <p className="text-ui-fg-subtle text-base mb-1">데이터가 없습니다</p>
            <p className="text-ui-fg-muted text-sm">
              {search
                ? "검색 조건에 맞는 디지털 자산이 없습니다"
                : statusFilters.length > 0
                  ? "선택한 필터에 맞는 디지털 자산이 없습니다"
                  : "디지털 자산을 추가해보세요"}
            </p>
          </div>
        ) : (
          <DataTable.Table />
        )}

        <DataTable.Pagination />
        <DataTable.CommandBar selectedLabel={(count) => `${count}개 선택됨`} />
      </DataTable>
    </SingleColumnLayout>
  );
};

export default AssetListTable;
