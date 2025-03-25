"use client";
import React, { ChangeEvent } from "react";
import { useParams } from "next/navigation";
import useProjectStore from "@/stores/project/useProjectStore";

interface Props {
  className?: string;
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
  const { inputProject, setInputProject } = useProjectStore();

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

  const formatLabel = (label: string) => {
    return label
      .replace(/([A-Z])/g, " $1") // Insert space before uppercase letters
      .replace(/^./, (str) => str.toUpperCase()) // Capitalize the first letter
      .trim();
  };

  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">{formatLabel(label)}</label>
      <div>
        {label === "longDescription" ? (
          <textarea
            className="w-full min-h-48"
            value={value}
            onChange={handleChange}
            rows={5} // Adjust rows as needed
          />
        ) : (
          <input
            className="overflow-auto w-full md:w-[40vw] xl:w-[512px]"
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
