"use client";
import React, { ChangeEvent } from "react";
import { useParams } from "next/navigation";
import useProjectStore from "@/stores/project/useProjectStore";
import { Project } from "@/types/data/project";

interface Props {
  label: "name" | "logo" | "description" | "website" | "github";
}

const EditString: React.FC<Props> = ({ label }) => {
  const { id } = useParams();
  const projectId = Number(id);

  // Get the persistent project data from the store.
  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === projectId)
  );
  // Get the temporary (non-persisted) inputProject state and its setter.
  const inputProject = useProjectStore((state) => state.inputProject);
  const setInputProject = useProjectStore((state) => state.setInputProject);

  // Use the temporary state if available; otherwise, fall back to the persistent project.
  const value =
    inputProject && label in inputProject
      ? inputProject[label]
      : project
      ? project[label]
      : "";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
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
        <input
          className="p-1 rounded-xl field-sizing-content min-w-24 max-w-full"
          type="text"
          value={value}
          onChange={handleChange}
        />
      </div>
    </div>
  );
};

export default EditString;
