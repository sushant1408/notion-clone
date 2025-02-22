import { create } from "zustand";

interface SearchStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  toggle: () => void;
};

const useSearch = create<SearchStore>((set, get) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
  toggle: () => set({ isOpen: !get().isOpen }),
}));

export { useSearch };
