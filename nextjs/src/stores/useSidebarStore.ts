import { create } from "zustand";

interface Store {
  isOpen: boolean;
  setSidebar: (isOpen: boolean) => void;
}

const useSidebarStore = create<Store>((set) => ({
  isOpen: false, // Initial state of the sidebar (closed by default)
  setSidebar: (isOpen) => set({ isOpen }), // Directly set the state based on the argument
}));

export default useSidebarStore;
