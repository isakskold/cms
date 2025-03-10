"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import useProjectStore from "@/stores/project/useProjectStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import fetchProjects from "@/requests/project/fetchProjects";
import Loading from "../utils/loading";

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
      )}
    </div>
  );
};

export default Overview;
