"use client";

import { useState } from "react";
import deleteProject from "@/requests/project/deleteProject";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import useProjectStore from "@/stores/project/useProjectStore";
import Loading from "@/components/utils/loading";

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
      className="px-4 w-fit py-2 text-white rounded  bg-red-500 hover:bg-red-700"
      onClick={handleDelete}
    >
      Delete Project
    </button>
  );
};

export default DeleteProjectBtn;
