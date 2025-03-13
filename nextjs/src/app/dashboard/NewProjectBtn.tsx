"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { v4 as uuidv4 } from "uuid";
import Loading from "@/components/utils/loading";

interface Props {}

const NewProjectBtn: React.FC<Props> = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleNewProjectClick = async () => {
    setLoading(true);
    const newId = uuidv4();
    router.push(`/project/${newId}`);
  };

  return loading ? (
    <Loading text="" classname="tracking-widest mb-14 mx-auto text-white" />
  ) : (
    <button
      onClick={handleNewProjectClick}
      className="w-fit text-white bg-green-500 hover:bg-green-700 rounded-md p-2 mb-14 mx-auto tracking-widest"
    >
      New project
    </button>
  );
};

export default NewProjectBtn;
