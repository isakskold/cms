"use client";

import deleteProject from "@/requests/project/deleteProject";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useProjectStore from "@/stores/project/useProjectStore";

interface Props {
  projectId: string;
}

const DeleteProjectBtn: React.FC<Props> = ({ projectId }) => {
  const { access_token } = useAuthStore().tokenData || {};
  const { removeProject } = useProjectStore();
  const router = useRouter();

  const handleDeletion = async () => {
    try {
      await deleteProject(access_token as string, projectId);
      removeProject(projectId); // Remove project from local storage too

      router.push("/dashboard");
      // Delay the alert to show after the navigation
      setTimeout(() => {
        alert("Project deleted successfully");
      }, 100);
    } catch (error) {
      console.error("Error deleting project:", error);
      alert("Failed to delete project");
    }
  };

  return (
    <button
      className="px-4 py-2 text-white rounded  bg-red-500 hover:bg-red-700"
      onClick={handleDeletion}
    >
      Delete Project
    </button>
  );
};

export default DeleteProjectBtn;
