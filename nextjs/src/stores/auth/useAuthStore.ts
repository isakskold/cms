import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CognitoData {
  access_token: string;
  id_token: string;
  refresh_token?: string;
  token_type: string;
  expires_in: number;
}

interface AuthStore {
  tokenData: CognitoData | null;
  setTokenData: (token: CognitoData | null) => void;

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

      tokenData: null,
      setTokenData: (tokenData) => {
        set({ tokenData });
        set({ isLoggedIn: tokenData !== null });
      },
    }),
    {
      name: "auth-storage", // Key used in localStorage
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      partialize: (state) => ({
        email: state.email,
        isLoggedIn: state.isLoggedIn,
        tokenData: state.tokenData,
      }),
    }
  )
);
