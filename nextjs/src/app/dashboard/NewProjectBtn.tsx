"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import useProjectStore from "@/stores/project/useProjectStore";

interface Props {}

const NewProjectBtn: React.FC<Props> = () => {
  const router = useRouter();
  const { addProject } = useProjectStore();

  const handleNewProjectClick = () => {
    // Generate a new unique id using uuid
    const newId = uuidv4();
    // Define the new project with default values
    const newProject = {
      id: newId,
      name: ``,
      lastEdited: new Date().toISOString(),
      logo: "",
      description: "",
      longDescription: ``,
      skills: [],
      website: "",
      github: "",
      images: [],
    };

    // Add the new project to the store
    addProject(newProject);

    // Optionally navigate to the new project page (e.g., edit page)
    router.push(`/project/${newId}`);
  };
  return (
    <button
      onClick={handleNewProjectClick}
      className="w-fit font-semibold bg-green-500 rounded-md p-1 my-3 mr-auto"
    >
      New project
    </button>
  );
};

export default NewProjectBtn;
