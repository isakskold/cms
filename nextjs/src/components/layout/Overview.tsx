"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useProjectStore from "@/stores/project/useProjectStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import fetchProjects from "@/requests/project/fetchProjects";
import Loading from "../utils/loading";
import formatDateTime from "../utils/formatTime";

const Overview: React.FC = () => {
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
          console.log("Response from fetchProjects:", response);
          console.log("Projects before setting in store:", response);
          setProjects(response);
          console.log(
            "Projects after setting in store:",
            useProjectStore.getState().projects
          );
          console.log("Initialized store with fetched data");
        } catch (error) {
          console.error("Error fetching projects:", error);
        } finally {
          setLoading(false); // Ensure loading is set to false regardless of success or failure
        }
      })();
    }
  }, [isHydrated, projects.length, access_token, setProjects]);

  const tableStyles = {
    th: "border border-sky-700 py-2 px-8 w-1/3 tracking-widest",
    td: "border border-black py-2 px-8 w-1/3 text-center whitespace-nowrap overflow-hidden text-ellipsis",
  };

  const handleRowClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
    setLoading(true);
  };

  return loading ? (
    <Loading text="" />
  ) : (
    <div className="overflow-x-auto rounded-2xl">
      <table className="w-full min-w-[680px] table-fixed border-collapse border border-sky-700 bg-sky-200">
        <thead className="">
          <tr className="bg-sky-700 text-white">
            <th className={tableStyles.th}>Project Name</th>
            <th className={tableStyles.th}>Description</th>
            <th className={tableStyles.th}>Last edited</th>
          </tr>
        </thead>
        <tbody>
          {[...projects]
            .sort((a, b) => {
              return (
                new Date(b.lastEdited || 0).getTime() -
                new Date(a.lastEdited || 0).getTime()
              );
            })
            .map((project) => (
              <tr
                key={project.id}
                onClick={() => handleRowClick(project.id)}
                className="hover:bg-sky-400 cursor-pointer h-8"
              >
                <td className={tableStyles.td}>{project.name}</td>
                <td className={tableStyles.td}>{project.description}</td>
                <td className={tableStyles.td}>
                  {project.lastEdited
                    ? formatDateTime(project.lastEdited)
                    : "Never"}
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Overview;
