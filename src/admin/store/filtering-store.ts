import { DataTableFilteringState } from "@medusajs/ui";
import { create } from "zustand";

interface IFilteringState {
  filtering: DataTableFilteringState<Record<string, unknown>>;
  setFiltering: React.Dispatch<
    React.SetStateAction<DataTableFilteringState<Record<string, unknown>>>
  >;
}

export const useFilteringStore = create<IFilteringState>((set, get) => ({
  // 필터링 상태
  filtering: {},
  setFiltering: (filtering) =>
    set((prev) => ({
      ...prev,
      filtering: typeof filtering === "function" ? filtering(prev.filtering) : filtering,
    })),
}));
