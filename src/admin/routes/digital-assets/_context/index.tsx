// src/admin/routes/digital-assets/context/digital-asset-context.tsx
import React, { createContext, useContext, useState, ReactNode } from "react";
import { DigitalAsset } from "../_components/types";

type DigitalAssetContextType = {
  selectedAssets: string[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<string[]>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  currentAsset: DigitalAsset | null;
  setCurrentAsset: React.Dispatch<React.SetStateAction<DigitalAsset | null>>;
  isAssetFormModalOpen: boolean;
  setIsAssetFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
};

const DigitalAssetContext = createContext<DigitalAssetContextType | undefined>(undefined);

export const DigitalAssetProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentAsset, setCurrentAsset] = useState<DigitalAsset | null>(null);
  const [isAssetFormModalOpen, setIsAssetFormModalOpen] = useState(false);

  return (
    <DigitalAssetContext.Provider
      value={{
        selectedAssets,
        setSelectedAssets,
        isModalOpen,
        setIsModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
        currentAsset,
        setCurrentAsset,
        isAssetFormModalOpen,
        setIsAssetFormModalOpen,
      }}
    >
      {children}
    </DigitalAssetContext.Provider>
  );
};

export const useDigitalAsset = () => {
  const context = useContext(DigitalAssetContext);

  if (context === undefined) {
    throw new Error("useDigitalAsset은 DigitalAssetProvider 내에서 사용해야 합니다.");
  }
  return context;
};
