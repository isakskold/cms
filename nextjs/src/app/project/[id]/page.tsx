"use client";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import SaveOrDiscardBtn from "@/components/ui/buttons/SaveOrDiscardBtn";
import useProjectStore from "@/stores/project/useProjectStore";
import EditImages from "@/components/ui/edit/EditImages";
import EditSkills from "@/components/ui/edit/EditSkills";
import EditString from "@/components/ui/edit/EditString";
import { Project } from "@/types/data/project";

const ProjectPage = () => {
  const { id } = useParams();
  const projectId = String(id);
  const { projects, addProject, updateProject, inputProject, setInputProject } =
    useProjectStore();

  useEffect(() => {
    setInputProject(null); // Reset input state when switching projects
    console.log("Reset input state", inputProject);
  }, [projectId]); // Runs when projectId changes

  useEffect(() => {
    console.log("Updated inputProject:", inputProject);
  }, [inputProject]); // Logs whenever inputProject changes

  // Get the current project from the store
  const project = projects.find((p) => p.id === projectId);

  // Save changes by updating the project in the store
  const handleSave = () => {
    if (inputProject) {
      console.log("input project to save", inputProject);

      const newProject = {
        ...inputProject,
        lastEdited: new Date().toISOString(),
      };
      updateProject(newProject);
    }
  };

  if (!project) return <p>Loading...</p>;

  return (
    <div className="flex flex-col justify-between flex-1 p-4">
      <div className="flex flex-col gap-16">
        <div className="flex flex-col gap-4">
          <EditString label="name" />
          <EditString label="logo" />
          <EditString label="description" />
          <EditString label="longDescription" />
          <EditSkills />
          <EditImages />
          <EditString label="website" />
          <EditString label="github" />
        </div>

        <div className="flex justify-around">
          <SaveOrDiscardBtn action="save" onClick={handleSave} />
          <SaveOrDiscardBtn
            action="discard"
            onClick={() => console.log("Discarded")}
          />
        </div>
      </div>

      <div className="mt-20">
        <p>
          <strong>Project ID:</strong> {project.id}
        </p>
        <p>
          <strong>Last Edited:</strong> {project.lastEdited || "Never"}
        </p>
      </div>
    </div>
  );
};

export default ProjectPage;
