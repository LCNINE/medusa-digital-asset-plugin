import { create } from "zustand";

type DigitalAssetStore = {
  showDeleted: boolean;
  setShowDeleted: (show: boolean) => void;
  selectedAssets: string[];
  setSelectedAssets: (assets: string[]) => void;
};

export const useDigitalAssetStore = create<DigitalAssetStore>((set) => ({
  showDeleted: false,
  setShowDeleted: (show) => set({ showDeleted: show }),
  selectedAssets: [],
  setSelectedAssets: (assets) => set({ selectedAssets: assets }),
}));
