"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useProjectStore from "@/stores/project/useProjectStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import fetchProjects from "@/requests/project/fetchProjects";
import Loading from "../utils/loading";
import formatDateTime from "../utils/formatTime";

interface Props {}

const Overview: React.FC<Props> = () => {
  const router = useRouter();
  const { projects, setProjects } = useProjectStore();
  const { access_token } = useAuthStore().tokenData || {};
  const { isHydrated } = useAuthStore();

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!isHydrated) return;

    // Only fetch from database if zustand state is empty
    if (projects.length === 0) {
      (async () => {
        try {
          setLoading(true);
          const response = await fetchProjects(access_token as string);
          setProjects(response);
          console.log("Initialized store with fetched data");
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false); // Ensure loading is set to false regardless of success or failure
        }
      })();
    }
  }, [isHydrated, projects.length, access_token, setProjects]);

  return (
    <div className="overflow-x-auto">
      {loading ? (
        <Loading text="Loading projects..." />
      ) : (
        <table className="w-full border-collapse border border-sky-700 bg-sky-200">
          <thead>
            <tr className="bg-sky-700 text-white">
              <th className="border border-sky-700 p-2 w-1/3 tracking-widest">
                Project Name
              </th>
              <th className="border border-sky-700 p-2 w-1/3 tracking-widest">
                Description
              </th>
              <th className="border border-sky-700 p-2 w-1/3 tracking-widest">
                Last edited
              </th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr
                key={project.id}
                onClick={() => router.push(`/project/${project.id}`)}
                className="hover:bg-sky-400 cursor-pointer h-8"
              >
                <td className="border border-black p-2 w-1/3 text-center">
                  {project.name}
                </td>
                <td className="border border-black p-2 w-1/3 text-center">
                  {project.description}
                </td>
                <td className="border border-black p-2 w-1/3 text-center">
                  {project.lastEdited
                    ? formatDateTime(project.lastEdited)
                    : "Never"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Overview;
