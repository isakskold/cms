"use client";

import deleteProject from "@/requests/project/deleteProject";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useProjectStore from "@/stores/project/useProjectStore";

interface Props {
  projectId: string;
  projectExist: boolean;
}

const DeleteProjectBtn: React.FC<Props> = ({ projectId, projectExist }) => {
  const { access_token } = useAuthStore().tokenData || {};
  const { removeProject } = useProjectStore();
  const router = useRouter();

  const handleDelete = async () => {
    try {
      await deleteProject(access_token as string, projectId);
      removeProject(projectId);
      router.push("/dashboard");
    } catch {
      alert("Failed to delete project");
    }
  };

  // If the project doesn't exist it is being created, so here we can hide the delete button
  if (!projectExist) return null;

  return (
    <button
      className="inline-flex items-center justify-center px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 bg-red-600 text-white hover:bg-red-700 border border-red-600"
      onClick={handleDelete}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        className="h-5 w-5 mr-2"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
        />
      </svg>
      Delete Project
    </button>
  );
};

export default DeleteProjectBtn;
