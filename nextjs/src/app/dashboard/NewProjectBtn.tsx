"use client";

import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";

interface Props {}

const NewProjectBtn: React.FC<Props> = () => {
  const router = useRouter();

  const handleNewProjectClick = () => {
    // Generate a new unique id using uuid
    const newId = uuidv4();

    // Optionally navigate to the new project page (e.g., edit page)
    router.push(`/project/${newId}`);
  };
  return (
    <button
      onClick={handleNewProjectClick}
      className="w-fi text-white bg-green-500 hover:bg-green-700 rounded-md p-1 my-3 mr-auto"
    >
      New project
    </button>
  );
};

export default NewProjectBtn;
