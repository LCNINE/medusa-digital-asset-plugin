import { create } from "zustand";
import { EntityType, ModalType } from "../types/modal.type";

interface IDetailModalState {
  selectedIds: string[];
  setSelectedIds: (ids: string[] | string) => void;

  selectedId: string | null;
  setSelectedId: (id: string | null) => void;

  modalType: ModalType;
  setModalType: (type: ModalType) => void;

  entityType: EntityType;
  setEntityType: (type: EntityType) => void;

  isFormModalOpen: boolean;
  setIsFormModalOpen: (isOpen: boolean) => void;
}

export const useModalStore = create<IDetailModalState>((set, get) => ({
  // 선택된 자산 목록
  selectedIds: [],
  setSelectedIds: (ids) =>
    set((state) => {
      if (Array.isArray(ids)) {
        return { selectedIds: ids };
      } else {
        return { selectedIds: [...state.selectedIds, ids] };
      }
    }),

  // 모달 상태들
  modalType: null,
  setModalType: (type) => set({ modalType: type }),

  // 어떤 종류의 모달 타입인지
  entityType: null,
  setEntityType: (type) => set({ entityType: type }),

  isFormModalOpen: false,
  setIsFormModalOpen: (state: boolean) => set({ isFormModalOpen: state }),

  // 선택된 자산 ID
  selectedId: null,
  setSelectedId: (id) => set({ selectedId: id }),
}));
