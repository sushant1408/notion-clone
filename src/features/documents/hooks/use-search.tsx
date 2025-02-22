import { create } from "zustand";

interface CoverImageStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

const useCoverImageModal = create<CoverImageStore>((set, get) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export { useCoverImageModal };
