import { create } from "zustand";

interface SettingsStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

const useSettings = create<SettingsStore>((set) => ({
  isOpen: false,
  onClose: () => set({ isOpen: false }),
  onOpen: () => set({ isOpen: true }),
}));

export { useSettings };
