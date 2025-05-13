// src/admin/routes/digital-assets/context/digital-asset-context.tsx
import React, { createContext, ReactNode, useContext, useState } from "react";

type DigitalAssetContextType = {
  selectedAssets: string[];
  setSelectedAssets: React.Dispatch<React.SetStateAction<string[]>>;
  isModalOpen: boolean;
  setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isDeleteModalOpen: boolean;
  setIsDeleteModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  isAssetFormModalOpen: boolean;
  setIsAssetFormModalOpen: React.Dispatch<React.SetStateAction<boolean>>;
  selectedAssetId: string | null;
  setSelectedAssetId: React.Dispatch<React.SetStateAction<string | null>>;
};

const DigitalAssetContext = createContext<DigitalAssetContextType | undefined>(undefined);

export const DigitalAssetProvider = ({ children }: { children: ReactNode }) => {
  const [selectedAssets, setSelectedAssets] = useState<string[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [isAssetFormModalOpen, setIsAssetFormModalOpen] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState<string | null>(null);
  return (
    <DigitalAssetContext.Provider
      value={{
        selectedAssetId,
        setSelectedAssetId,
        selectedAssets,
        setSelectedAssets,
        isModalOpen,
        setIsModalOpen,
        isDeleteModalOpen,
        setIsDeleteModalOpen,
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
