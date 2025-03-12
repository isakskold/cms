"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SaveOrDiscardBtn from "@/components/ui/buttons/SaveOrDiscardBtn";
import useProjectStore from "@/stores/project/useProjectStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import EditImages from "@/components/ui/edit/EditImages";
import EditSkills from "@/components/ui/edit/EditSkills";
import EditString from "@/components/ui/edit/EditString";
import createProject from "@/requests/project/createOrUpdateProject";
import DeleteProjectBtn from "./DeleteProjectBtn";
import formatDateTime from "@/components/utils/formatTime";

const ProjectPage = () => {
  const { id } = useParams();
  const router = useRouter();
  const projectId = String(id);
  const { projects, updateProject, inputProject, setInputProject, addProject } =
    useProjectStore();
  const { access_token } = useAuthStore().tokenData || {};

  const [successMsg, setSuccessMsg] = useState<string | null>();
  const [success, setSuccess] = useState<boolean>(false);
  const project = projects.find((p) => p.id === projectId);

  // Save changes by updating the project in the store
  const handleSave = async () => {
    try {
      if (inputProject) {
        const newProject = {
          ...inputProject,
          lastEdited: new Date().toISOString(),
        };

        // Create the project via the API
        await createProject(access_token as any, newProject);
        setSuccessMsg("Project saved...");
        setSuccess(true);

        if (project) {
          // If the project exists in the store, update it
          updateProject(newProject);
          console.log("Project updated successfully.");
        } else {
          // If the project does not exist in the store, add it
          addProject(newProject);
          console.log("Project added successfully.");
        }

        // Navigate to /dashboard after 2 seconds
        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving project:", error);
    }
  };

  const handleDiscard = () => {
    if (project) {
      // Reset inputProject to match the project from the store
      setInputProject({
        ...project, // Copy all fields from the existing project
      });
    } else {
      // Reset inputProject to empty strings if the project doesn't exist in the store
      setInputProject({
        id: "",
        lastEdited: "",
        name: "",
        logo: "",
        description: "",
        longDescription: "",
        skills: [],
        website: "",
        github: "",
        images: [],
      });
    }
  };

  return (
    <div className="flex flex-col justify-between flex-1 p-4">
      <div>
        <div className="flex flex-col gap-16 md:flex-row md:justify-between mb-16">
          <div className="flex flex-col gap-4">
            <EditString label="name" />
            <EditString label="logo" />
            <EditString label="description" />
            <div className="md:hidden">
              <EditString label="longDescription" />
            </div>

            <EditSkills />
            <EditImages />
            <EditString label="website" />
            <EditString label="github" />
          </div>

          <div className="hidden md:inline-block min-w-[40%]">
            <EditString label="longDescription" />
          </div>
        </div>

        {success ? (
          <span className="text-center text-green-500 text-xl font-semibold tracking-wider">
            {successMsg}
          </span>
        ) : (
          <div className="flex justify-around">
            <SaveOrDiscardBtn action="save" onClick={handleSave} />
            <SaveOrDiscardBtn action="discard" onClick={handleDiscard} />
          </div>
        )}
      </div>

      <div className="mt-20 flex flex-col gap-6">
        <DeleteProjectBtn projectId={projectId} />
        <p>
          <strong>Project ID:</strong> {projectId}
        </p>
        <p>
          <strong>Last Edited:</strong>{" "}
          {project?.lastEdited ? formatDateTime(project.lastEdited) : "Never"}
        </p>
      </div>
    </div>
  );
};

export default ProjectPage;
