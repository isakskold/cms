import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthStore {
  email: string | null;
  setEmail: (email: string | null) => void;

  isLoggedIn: boolean;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      email: null,
      isLoggedIn: false, // Default to false

      setEmail: (email) => {
        set({ email });
        set({ isLoggedIn: email !== null }); // Ensure isLoggedIn updates correctly
      },
    }),
    {
      name: "auth-storage", // Key used in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      partialize: (state) => ({
        email: state.email,
        isLoggedIn: state.isLoggedIn,
      }), // Only persist email
    }
  )
);
