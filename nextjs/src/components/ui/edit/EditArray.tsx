"use client";
import React, { useState } from "react";
import { useParams } from "next/navigation";
import useProjectStore from "@/stores/project/useProjectStore";
import Image from "next/image";

interface Props {
  label: "skills" | "images";
}

const EditArray: React.FC<Props> = ({ label }) => {
  const { id } = useParams();
  const projectId = String(id);

  const project = useProjectStore((state) =>
    state.projects.find((p) => p.id === projectId)
  );
  const { inputProject, setInputProject } = useProjectStore();

  const items = inputProject?.[label] ?? project?.[label] ?? [];
  const [input, setInput] = useState("");

  const handleAdd = () => {
    if (!inputProject || !input.trim()) return;

    setInputProject({ ...inputProject, [label]: [...items, input.trim()] });
    setInput("");
  };

  const handleRemove = (index: number) => {
    if (!inputProject) return;

    setInputProject({
      ...inputProject,
      [label]: items.filter((_, i) => i !== index),
    });
  };

  const formatLabel = (label: string) =>
    label.charAt(0).toUpperCase() + label.slice(1);

  return (
    <div className="flex flex-col gap-1">
      <label className="font-semibold">{formatLabel(label)}</label>
      <input
        className="overflow-auto w-full md:w-[40vw] xl:w-[512px]"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder={label === "images" ? "Add image URL..." : "Add skill..."}
      />
      <button
        className="bg-blue-500 mt-2 mb-4 text-white px-4 py-2 rounded w-fit hover:bg-blue-700"
        onClick={handleAdd}
      >
        Add
      </button>
      <ul className="mt-2 flex flex-col gap-6 text-white">
        {items.map((item, index) => (
          <li
            key={index}
            className="flex justify-between items-center border p-2 rounded"
          >
            {label === "images" ? (
              <Image
                src={item}
                alt={`Preview ${index}`}
                width={40}
                height={40}
                className="h-10 w-10 object-cover rounded"
              />
            ) : (
              <span>{item}</span>
            )}
            <button
              className="bg-red-500 text-white px-2 py-1 rounded"
              onClick={() => handleRemove(index)}
            >
              Remove
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default EditArray;
