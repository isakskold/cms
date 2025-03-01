"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { mockData } from "@/mockData/projects";
import useProjectStore from "@/stores/project/useProjectStore";

interface Props {}

const Overview: React.FC<Props> = () => {
  const router = useRouter();
  const { projects, setProjects } = useProjectStore();

  // Initialize store with mock data if empty
  useEffect(() => {
    if (projects.length === 0) {
      setProjects(mockData);
      console.log("Initialized store with mock data");
    }
  }, [projects.length, setProjects]);

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">ID</th>
            <th className="border p-2">Project Name</th>
            <th className="border p-2">Last edited</th>
          </tr>
        </thead>
        <tbody>
          {projects.map((project) => (
            <tr
              key={project.id}
              onClick={() => router.push(`/project/${project.id}`)}
              className="hover:bg-gray-50 cursor-pointer"
            >
              <td className="border p-2">{project.id}</td>
              <td className="border p-2">{project.name}</td>
              <td className="border p-2">{project.lastEdited || "Never"}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Overview;
