import { DataTableFilteringState } from "@medusajs/ui";
import { create } from "zustand";

interface DigitalAssetState {
  selectedAssets: string[];
  setSelectedAssets: (assets: string[] | string) => void;

  selectedAssetId: string | null;
  setSelectedAssetId: (id: string | null) => void;

  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;

  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: (isOpen: boolean) => void;

  isAssetFormModalOpen: boolean;
  setIsAssetFormModalOpen: (isOpen: boolean) => void;

  filtering: DataTableFilteringState<Record<string, unknown>>;
  setFiltering: React.Dispatch<
    React.SetStateAction<DataTableFilteringState<Record<string, unknown>>>
  >;
}

export const useDigitalAssetStore = create<DigitalAssetState>((set, get) => ({
  // 선택된 자산 목록
  selectedAssets: [],
  setSelectedAssets: (assets) =>
    set((state) => {
      if (Array.isArray(assets)) {
        return { selectedAssets: assets };
      } else {
        return { selectedAssets: [...state.selectedAssets, assets] };
      }
    }),

  // 모달 상태들
  isModalOpen: false,
  setIsModalOpen: (isOpen) => set({ isModalOpen: isOpen }),

  isDeleteModalOpen: false,
  setIsDeleteModalOpen: (isOpen) => set({ isDeleteModalOpen: isOpen }),

  isAssetFormModalOpen: false,
  setIsAssetFormModalOpen: (isOpen) => set({ isAssetFormModalOpen: isOpen }),

  // 선택된 자산 ID
  selectedAssetId: null,
  setSelectedAssetId: (id) => set({ selectedAssetId: id }),

  filtering: {},
  setFiltering: (filtering) =>
    set((prev) => ({
      ...prev,
      filtering: typeof filtering === "function" ? filtering(prev.filtering) : filtering,
    })),
}));
