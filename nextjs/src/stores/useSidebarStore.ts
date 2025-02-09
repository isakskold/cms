import { create } from "zustand";

interface Store {
  isOpen: boolean;
  toggleSidebar: () => void;
}

const useSidebarStore = create<Store>((set) => ({
  isOpen: false, // Initial state of the sidebar (closed by default)
  toggleSidebar: () => set((state) => ({ isOpen: !state.isOpen })),
}));

export default useSidebarStore;
