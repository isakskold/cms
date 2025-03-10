"use client";
import React, { ChangeEvent, useEffect } from "react";
import { useParams } from "next/navigation";
import useProjectStore from "@/stores/project/useProjectStore";

interface Props {
  label:
    | "name"
    | "logo"
    | "description"
    | "website"
    | "github"
    | "longDescription";
}

const EditString: React.FC<Props> = ({ label }) => {
  const { id } = useParams();
  const projectId = String(id);

  // Get the persistent project data from the store.
  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === projectId)
  );
  // Get the temporary (non-persisted) inputProject state and its setter.
  const inputProject = useProjectStore((state) => state.inputProject);
  const setInputProject = useProjectStore((state) => state.setInputProject);

  // Initialize inputProject with default values if it's a new project (id not found in store).
  useEffect(() => {
    if (!project) {
      console.log("Setting up the project to create");

      // Initialize inputProject with default values for a new project
      setInputProject({
        id: id as string,
        lastEdited: new Date().toISOString(),
        name: "",
        logo: "",
        description: "",
        longDescription: "",
        skills: [],
        website: "",
        github: "",
        images: [],
      });
    } else if (project) {
      // If project exists, update inputProject with the project data
      setInputProject(project);
    }
  }, []);

  // Determine the value for the input field:
  // - If inputProject exists, use that.
  // - If inputProject doesn't exist but project does, use the persistent project.
  // - Otherwise, fall back to an empty string.
  const value =
    inputProject && label in inputProject
      ? inputProject[label]
      : project && label in project
      ? project[label]
      : "";

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    // If there's already temporary data, update it.
    if (inputProject) {
      setInputProject({ ...inputProject, [label]: e.target.value });
    } else if (project) {
      // Otherwise, initialize inputProject with the persistent project data and update the field.
      setInputProject({ ...project, [label]: e.target.value });
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">{label}</label>
      <div>
        {label === "longDescription" ? (
          <textarea
            className="p-1 rounded-xl field-sizing-content min-w-24 max-w-full"
            value={value}
            onChange={handleChange}
            rows={5} // Adjust rows as needed
          />
        ) : (
          <input
            className="p-1 rounded-xl field-sizing-content min-w-24 max-w-full"
            type="text"
            value={value}
            onChange={handleChange}
          />
        )}
      </div>
    </div>
  );
};

export default EditString;
