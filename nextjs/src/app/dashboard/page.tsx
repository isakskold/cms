"use client";
import Link from "next/link";
import useProjectStore from "@/stores/project/useProjectStore";
import formatDateTime from "@/components/utils/formatTime";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const { projects, isHydrated } = useProjectStore();
  const router = useRouter();

  if (!isHydrated) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8">
      {projects.length > 0 ? (
        <>
          <div className="bg-gray-50 rounded-lg shadow-sm p-5 mb-10">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div className="flex-1">
                <h1 className="text-3xl font-bold text-gray-800 tracking-tight mb-1">
                  My Projects
                </h1>
                <p className="text-base text-gray-600">
                  {projects.length} project{projects.length !== 1 ? "s" : ""} in
                  total
                </p>
              </div>
              <Link
                href="/project/new"
                className="shrink-0 inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 group"
              >
                <span className="flex items-center">
                  <span className="bg-blue-500 rounded-full p-1 mr-2 group-hover:bg-blue-400 transition-colors duration-200">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </span>
                  Create New Project
                </span>
              </Link>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <Link
                key={project.id}
                href={`/project/${project.id}`}
                className="group block"
              >
                <div className="bg-white rounded-lg border border-gray-200 overflow-hidden transition-shadow duration-200 hover:shadow-lg">
                  <div className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <h2 className="text-lg font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors duration-200">
                          {project.name || "Untitled Project"}
                        </h2>
                        <p className="mt-1 text-sm text-gray-500">
                          Last edited {formatDateTime(project.lastEdited)}
                        </p>
                      </div>
                      <div className="ml-4">
                        <div className="rounded-full p-2 bg-gray-50 group-hover:bg-blue-50 transition-colors duration-200">
                          <svg
                            className="w-5 h-5 text-gray-400 group-hover:text-blue-500 transition-colors duration-200"
                            fill="none"
                            stroke="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M9 5l7 7-7 7"
                            />
                          </svg>
                        </div>
                      </div>
                    </div>
                    <p className="mt-3 text-sm text-gray-600 line-clamp-2">
                      {project.description || "No description provided"}
                    </p>
                  </div>
                  <div className="px-6 py-4 bg-gray-50 border-t border-gray-100">
                    <div className="flex items-center text-sm text-gray-500">
                      <svg
                        className="h-5 w-5 mr-2 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      {formatDateTime(project.lastEdited)}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[60vh] text-center px-4">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm p-8 border border-gray-100">
            <div className="mb-8">
              <svg
                className="w-24 h-24 mx-auto text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={1.5}
                  d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              No Projects Yet
            </h2>
            <p className="text-lg text-gray-600 mb-8 leading-relaxed">
              Start by creating your first project. You can add custom fields,
              images, and more to showcase your work.
            </p>
            <button
              onClick={() => router.push("/project/new")}
              className="inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 shadow-sm transition-all duration-200"
            >
              <svg
                className="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                />
              </svg>
              Create New Project
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
