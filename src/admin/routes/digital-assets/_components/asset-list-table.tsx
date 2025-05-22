import {
  Checkbox,
  CommandBar,
  Container,
  createDataTableColumnHelper,
  createDataTableFilterHelper,
  DataTable,
  DataTablePaginationState,
  DataTableSortingState,
  Text,
  toast,
  useDataTable,
} from "@medusajs/ui";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { DigitalAsset } from "../../../../../.medusa/types/query-entry-points";
import { useFilteringStore } from "../../../../store/filtering-store";
import { useModalStore } from "../../../../store/modal-store";
import ConfirmModal from "../../../components/modal/confirm-modal";
import { SingleColumnLayout } from "../../../layout/single-column";
import { useAssets } from "../_hooks/digital-assets/use-assets";
import { useDeleteAssetMutation } from "../_hooks/digital-assets/use-delete-asset";
import { useRestoreAssetsMutation } from "../_hooks/digital-assets/use-restore-asset";

const columnHelper = createDataTableColumnHelper<DigitalAsset>();

const columns = [
  columnHelper.accessor("id", {
    header: "ID",
    enableSorting: true,
  }),
  columnHelper.accessor("name", {
    header: "Name",
    enableSorting: true,
    sortLabel: "Name",
    sortAscLabel: "A-Z",
    sortDescLabel: "Z-A",
  }),
  columnHelper.accessor("mime_type", {
    header: "File Type",
  }),
  columnHelper.accessor("created_at", {
    header: "Created At",
    enableSorting: true,
  }),
];

const filterHelper = createDataTableFilterHelper<DigitalAsset>();

const filters = [
  filterHelper.accessor("mime_type", {
    type: "select",
    label: "File Type",
    options: [
      {
        label: "Image",
        value: "image/",
      },
      {
        label: "Video",
        value: "video/",
      },
      {
        label: "Audio",
        value: "audio/",
      },
      {
        label: "PDF",
        value: "application/pdf",
      },
    ],
  }),
  filterHelper.accessor("deleted_at", {
    type: "radio",
    label: "보기 옵션",
    options: [
      {
        label: "삭제된 항목만 보기",
        value: "true",
      },
      {
        label: "삭제되지 않은 항목만 보기",
        value: "false",
      },
    ],
  }),
];

const limit = 20;

interface IAssetListTableProps {
  onViewAsset: (assetId: string) => void;
}

const AssetListTable = ({ onViewAsset }: IAssetListTableProps) => {
  const [pagination, setPagination] = useState<DataTablePaginationState>({
    pageSize: limit,
    pageIndex: 0,
  });
  const [search, setSearch] = useState<string>("");
  const [sorting, setSorting] = useState<DataTableSortingState | null>(null);

  const {
    selectedId,
    setSelectedId,
    selectedIds,
    setSelectedIds,
    setIsFormModalOpen,
    modalType,
    setModalType,
  } = useModalStore();

  const { filtering, setFiltering } = useFilteringStore();

  const offset = useMemo(() => {
    return pagination.pageIndex * limit;
  }, [pagination]);

  const statusFilters = useMemo(() => {
    return (filtering.mime_type || []) as string[];
  }, [filtering]);

  const deletedAtFilters = useMemo(() => {
    return (filtering.deleted_at || []) as string[];
  }, [filtering]);

  const { data } = useAssets({
    offset,
    limit,
    search,
    statusFilters,
    deletedAtFilters,
    sorting,
  });

  const deleteAssets = useDeleteAssetMutation();
  const restoreAssets = useRestoreAssetsMutation();

  const hasSearchResults = data?.digital_assets && data.digital_assets.length > 0;

  const handleCloseModal = () => {
    setModalType(null);
    // setIsRestoreModalOpen(false);
    setSelectedId(null);
  };

  const handleConfirmDelete = () => {
    if (selectedIds.length > 0) {
      deleteAssets.mutate(selectedIds, {
        onSuccess: () => {
          setSelectedIds([]);
        },
      });
    }
    handleCloseModal();
  };

  const handleRestoreSelected = () => {
    if (!filtering.deleted_at) return;

    // 선택된 항목 중 삭제된 자산만 필터링
    const deletedAssetIds = selectedIds.filter((id) => {
      const asset = data?.digital_assets?.find((a) => a.id === id);
      return asset && asset.deleted_at;
    });

    if (deletedAssetIds.length === 0) {
      toast.error("복구할 삭제된 항목이 없습니다.");
      return;
    }

    if (confirm(`선택한 ${selectedIds.length}개 항목을 복구하시겠습니까?`)) {
      restoreAssets.mutate(deletedAssetIds, {
        onSuccess: () => {
          setSelectedIds([]);
        },
      });
    }
  };

  const handleSelectAsset = (assetId: string, checked: boolean) => {
    if (checked) {
      // 새로 체크한 경우
      const willHaveOneSelection = selectedIds.length === 0;
      setSelectedIds(assetId);

      // 첫 번째 선택인 경우에만 selectedAssetId 설정, 나머지는 null
      if (willHaveOneSelection) {
        setSelectedId(assetId);
      } else {
        setSelectedId(null);
      }
    } else {
      // 체크 해제된 경우
      const filteredAssets = selectedIds.filter((id) => id !== assetId);
      setSelectedIds(filteredAssets);

      // 체크 해제 후 남은 자산이 하나뿐이면 그것을 selectedAssetId로 설정
      if (filteredAssets.length === 1) {
        setSelectedId(filteredAssets[0]);
      } else {
        setSelectedId(null);
      }
    }
  };

  const handleViewSelected = () => {
    if (selectedIds.length !== 1) {
      toast.error("편집할 항목은 한개만 선택해주세요.");
      return;
    }

    if (selectedIds.length === 1) {
      const asset = data?.digital_assets?.find((a) => a.id === selectedIds[0]);

      if (asset) {
        setSelectedId(asset.id);
        setIsFormModalOpen(true);
      }
    }
  };

  const table = useDataTable({
    columns,
    data: (data?.digital_assets || []) as DigitalAsset[],
    getRowId: (row) => row.id,
    rowCount: data?.pagination.count || 0,
    pagination: {
      state: pagination,
      onPaginationChange: setPagination,
    },
    search: {
      state: search,
      onSearchChange: setSearch,
    },
    filtering: {
      state: filtering,
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
      <>
        <DataTable instance={table}>
          <DataTable.Toolbar className="flex flex-col items-start justify-between gap-2 md:flex-row md:items-center">
            <div className="flex gap-2">
              <DataTable.FilterMenu tooltip="Filter" />
              <DataTable.SortingMenu tooltip="Sort" />
              <DataTable.Search placeholder="Search..." />
            </div>
          </DataTable.Toolbar>

          {hasSearchResults ? (
            <div className="w-full">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-ui-border-base">
                    <th className="p-3 text-left">
                      <Checkbox
                        checked={
                          selectedIds.length > 0 &&
                          selectedIds.length === data?.digital_assets?.length
                        }
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setSelectedIds(data?.digital_assets?.map((asset) => asset.id));
                          } else {
                            setSelectedIds([]);
                          }
                        }}
                      />
                    </th>
                    <th className="p-3 text-left font-medium">ID</th>
                    <th className="p-3 text-left font-medium">Name</th>
                    <th className="p-3 text-left font-medium">File Type</th>
                    <th className="p-3 text-left font-medium">
                      {filtering.deleted_at === "true" ? "Deleted At" : "Created At"}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {data?.digital_assets?.map((asset) => (
                    <tr
                      key={asset.id}
                      className="border-b border-ui-border-base hover:bg-ui-bg-base-hover cursor-pointer"
                      onClick={() => onViewAsset(asset.id)}
                    >
                      <td className="p-3">
                        <Checkbox
                          checked={selectedIds.includes(asset.id)}
                          onCheckedChange={(checked) =>
                            handleSelectAsset(asset.id, checked === true ? true : false)
                          }
                          onClick={(e) => e.stopPropagation()}
                        />
                      </td>
                      <td className="p-3">{asset.id}</td>
                      <td className="p-3">{asset.name}</td>
                      <td className="p-3">{asset.mime_type}</td>
                      <td className="p-3">
                        {dayjs(asset.deleted_at || asset.created_at).format("YYYY-MM-DD")}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <Container className="flex flex-col items-center justify-center py-16">
              <Text className="text-ui-fg-subtle mb-4 text-center">
                {search || statusFilters.length > 0
                  ? "검색하신 조건에 맞는 디지털 자산이 없습니다"
                  : "디지털 자산이 없습니다"}
              </Text>
            </Container>
          )}

          <DataTable.Pagination />
        </DataTable>
      </>

      <CommandBar open={selectedIds.length > 0}>
        <CommandBar.Bar>
          {!filtering.deleted_at ? (
            <>
              <CommandBar.Value>{selectedIds.length}개 선택됨</CommandBar.Value>
              <CommandBar.Seperator />
              <CommandBar.Command
                action={() => {
                  setModalType("delete");
                }}
                label="삭제"
                shortcut="d"
              />

              <CommandBar.Seperator />
              <CommandBar.Command
                action={handleViewSelected}
                label="편집"
                shortcut="v"
                disabled={selectedIds.length !== 1}
              />
            </>
          ) : (
            <>
              <CommandBar.Value>{selectedIds.length}개 선택됨</CommandBar.Value>

              <CommandBar.Seperator />
              <CommandBar.Command action={handleRestoreSelected} label="복구" shortcut="r" />
            </>
          )}
        </CommandBar.Bar>
      </CommandBar>

      {/* 삭제 모달 */}
      <ConfirmModal
        isOpen={modalType === "delete"}
        onClose={handleCloseModal}
        onConfirm={handleConfirmDelete}
        title="디지털 자산 삭제"
        description={
          selectedId ? (
            <>
              정말로 이 디지털 자산을 삭제하시겠습니까?
              <br />
              해당 자산은 더 이상 판매 중인 상품에서 사용할 수 없습니다.
            </>
          ) : (
            <>
              선택한 {selectedIds.length}개 디지털 자산을 삭제하시겠습니까?
              <br />
              해당 자산은 더 이상 판매 중인 상품에서 사용할 수 없습니다.
            </>
          )
        }
        isLoading={deleteAssets.isPending}
        actionText="삭제"
        loadingText="삭제 중..."
        cancelText="취소"
      />
    </SingleColumnLayout>
  );
};

export default AssetListTable;
