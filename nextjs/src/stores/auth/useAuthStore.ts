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
            console.log(
              "Fetching projects with token:",
              tokenData.access_token
            );
            const response = await fetchProjects(tokenData.access_token);
            console.log("Projects fetch response:", response);

            if (response.data && response.data.projects) {
              console.log("Setting projects in store:", response.data.projects);
              useProjectStore.getState().setProjects(response.data.projects);
            } else {
              console.log("No projects found in response");
              useProjectStore.getState().setProjects([]);
            }
          } catch (error) {
            console.error("Error fetching projects:", error);
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
