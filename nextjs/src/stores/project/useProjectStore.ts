import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Project } from "@/types/data/project";

interface ProjectStore {
  projects: Project[];
  inputProject: Project | null; // Not persisted
  isHydrated: boolean;
  isLoading: boolean;
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (updatedProject: Project) => void;
  removeProject: (id: string) => void;
  setInputProject: (project: Project | null) => void;
  setIsLoading: (isLoading: boolean) => void;
}

const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      inputProject: null,
      isHydrated: false,
      isLoading: true,
      setProjects: (projects) => set({ projects }),
      addProject: (project) =>
        set((state) => ({ projects: [...state.projects, project] })),
      updateProject: (updatedProject) =>
        set((state) => ({
          projects: state.projects.map((p) =>
            p.id === updatedProject.id ? updatedProject : p
          ),
        })),
      removeProject: (id) =>
        set((state) => ({
          projects: state.projects.filter((p) => p.id !== id),
        })),
      setInputProject: (project) => set({ inputProject: project }),
      setIsLoading: (isLoading) => set({ isLoading }),
    }),
    {
      name: "projects-store",
      partialize: (state) => ({ projects: state.projects }),
      onRehydrateStorage: () => (state) => {
        // Keep loading true during hydration
        if (state) {
          // Mark as hydrated and stop loading once rehydration is complete
          state.isHydrated = true;
          state.isLoading = false;
        }
      },
    }
  )
);

export default useProjectStore;
