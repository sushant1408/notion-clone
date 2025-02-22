import { create } from "zustand";

interface CoverImageModalStore {
  url?: string;
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onReplace: (url: string) => void;
}

const useCoverImageModal = create<CoverImageModalStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false, url: undefined }),
  onOpen: () => set({ isOpen: true, url: undefined }),
  onReplace: (url) => set({ isOpen: true, url }),
}));

export { useCoverImageModal };
