import { create } from "zustand";
import { persist } from "zustand/middleware";
import { Project } from "@/types/data/project";

interface ProjectStore {
  projects: Project[];
  inputProject: Project | null; // Not persisted
  setProjects: (projects: Project[]) => void;
  addProject: (project: Project) => void;
  updateProject: (updatedProject: Project) => void;
  removeProject: (id: string) => void;
  setInputProject: (project: Project | null) => void;
}

const useProjectStore = create<ProjectStore>()(
  persist(
    (set) => ({
      projects: [],
      inputProject: null,
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
    }),
    {
      name: "projects-store", // Key used in localStorage
      partialize: (state) => ({ projects: state.projects }), // Only persist projects
    }
  )
);

export default useProjectStore;
