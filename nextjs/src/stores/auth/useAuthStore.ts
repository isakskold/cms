import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import useProjectStore from "../project/useProjectStore";
import fetchProjects from "@/requests/project/fetchProjects";

interface CognitoData {
  access_token: string;
}

interface AuthStore {
  tokenData: CognitoData | null;
  setTokenData: (token: CognitoData | null) => void;

  isLoggedIn: boolean;

  isHydrated: boolean;

  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      isLoggedIn: false, // Default to false

      tokenData: null,
      setTokenData: async (tokenData) => {
        // First set the token data and login state
        set({ tokenData });
        set({ isLoggedIn: tokenData !== null });

        // If we have a token, fetch the projects
        if (tokenData?.access_token) {
          try {
            const projects = await fetchProjects(tokenData.access_token);

            // Check if response is an array (our projects)
            if (Array.isArray(projects)) {
              useProjectStore.getState().setProjects(projects);
            } else if (projects.data?.projects) {
              // Fallback for nested structure
              useProjectStore.getState().setProjects(projects.data.projects);
            } else {
              useProjectStore.getState().setProjects([]);
            }
          } catch (error) {
            useProjectStore.getState().setProjects([]);
          }
        } else {
          // If no token, clear projects
          useProjectStore.getState().setProjects([]);
        }
      },

      isHydrated: false,

      logout: () => {
        set({
          tokenData: null,
          isLoggedIn: false,
        });
        useProjectStore.getState().setProjects([]);
      },
    }),
    {
      name: "auth-storage", // Key used in localStorage
      onRehydrateStorage: () => (state) => {
        if (state) {
          state.isHydrated = true;
        }
      },
      storage: createJSONStorage(() => localStorage), // Use localStorage for persistence
      partialize: (state) => ({
        isLoggedIn: state.isLoggedIn,
        tokenData: state.tokenData,
      }),
    }
  )
);
