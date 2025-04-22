"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import useProjectStore from "@/stores/project/useProjectStore";
import { useAuthStore } from "@/stores/auth/useAuthStore";
import EditFields from "@/components/ui/edit/EditFields";
import createProject from "@/requests/project/createOrUpdateProject";
import deleteProject from "@/requests/project/deleteProject";
import Header from "@/components/ui/edit/Header";
import formatDateTime from "@/components/utils/formatTime";
import { Project, CustomField } from "@/types/data/project";
import { v4 as uuidv4 } from "uuid";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useThemeStore } from "@/stores/theme/useThemeStore";
import {
  getPanelClasses,
  getHeaderDividerClasses,
  getHeadingClasses,
  getTextClasses,
  getSecondaryBgClasses,
} from "@/utils/darkModeClasses";

const ProjectPage = () => {
  const { isDarkMode } = useThemeStore();
  const { id } = useParams();
  const router = useRouter();
  const projectId = String(id);
  const {
    projects,
    updateProject,
    inputProject,
    setInputProject,
    addProject,
    isHydrated,
    removeProject,
  } = useProjectStore();
  const { access_token } = useAuthStore().tokenData || {};

  const [successMsg, setSuccessMsg] = useState<string | null>();
  const [success, setSuccess] = useState<boolean>(false);
  const [project, setProject] = useState<Project>();
  const [projectExists, setProjectExists] = useState<boolean>(false);
  const [fields, setFields] = useState<CustomField[]>([]);
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(true);
  const [discardFeedback, setDiscardFeedback] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState<boolean>(false);

  // Helper function to compare projects
  const areProjectsDifferent = (project1: Project, project2: Project) => {
    const keys = new Set([...Object.keys(project1), ...Object.keys(project2)]);
    for (const key of keys) {
      if (key === "lastEdited") continue; // Skip lastEdited as it's always different
      if (JSON.stringify(project1[key]) !== JSON.stringify(project2[key])) {
        return true;
      }
    }
    return false;
  };

  // Update hasChanges when inputProject changes
  useEffect(() => {
    if (project && inputProject) {
      setHasChanges(areProjectsDifferent(project, inputProject));
    } else if (!project && inputProject) {
      // For new projects, check if any fields have values
      const hasValues = Object.entries(inputProject).some(([key, value]) => {
        if (key === "id" || key === "lastEdited") return false;
        return value !== undefined && value !== null && value !== "";
      });
      setHasChanges(hasValues);
    }
  }, [inputProject, project]);

  useEffect(() => {
    // Check if the project exists in the store
    const foundProject = projects.find((p) => p.id === projectId);

    // If we found the project or have any projects (meaning localStorage was loaded),
    // we can exit the loading state
    if (foundProject || projects.length > 0 || isHydrated) {
      setIsPageLoading(false);

      // Handle "new" project case
      if (projectId === "new") {
        const newId = uuidv4();
        router.replace(`/project/${newId}`);
        return;
      }

      // Update project existence state
      const exists = !!foundProject;
      setProjectExists(exists);
      setProject(foundProject);

      // Initialize new project (either truly new or not found)
      if (!foundProject || projectId === "new") {
        // Initialize with just name and description for new projects
        const initialFields = [
          {
            id: "field-name",
            name: "Name",
            type: "input" as const,
            value: "",
          },
          {
            id: "field-description",
            name: "Description",
            type: "input" as const,
            value: "",
          },
        ];

        setFields(initialFields);
        setInputProject({
          id: projectId as string,
          lastEdited: new Date().toISOString(),
          name: "",
          description: "",
        });
      } else {
        // Convert existing project to fields
        const projectFields: CustomField[] = [
          {
            id: "field-name",
            name: "Name",
            type: "input" as const,
            value: foundProject.name || "",
          },
          {
            id: "field-description",
            name: "Description",
            type: "input" as const,
            value: foundProject.description || "",
          },
        ];

        // Add any other fields that exist in the project
        Object.entries(foundProject).forEach(([key, value]) => {
          if (
            key !== "id" &&
            key !== "name" &&
            key !== "description" &&
            key !== "lastEdited" &&
            !key.endsWith("_type") &&
            value !== undefined &&
            value !== null
          ) {
            const fieldType = determineFieldType(value);
            projectFields.push({
              id: `field-${key}`,
              name: key.charAt(0).toUpperCase() + key.slice(1),
              type: fieldType,
              value: value,
            });
          }
        });

        setFields(projectFields);
        setInputProject(foundProject);
      }
    }
  }, [id, isHydrated, projects, projectId, setInputProject, router]);

  // Helper function to determine field type
  const determineFieldType = (value: unknown): CustomField["type"] => {
    if (Array.isArray(value)) {
      // Check if the array contains image URLs
      if (
        value.length > 0 &&
        typeof value[0] === "string" &&
        (value[0].startsWith("http://") || value[0].startsWith("https://"))
      ) {
        return "image";
      }
      return "multiselect";
    }
    if (typeof value === "string") {
      if (value.includes("\n")) {
        return "textarea";
      }
      return "input";
    }
    if (typeof value === "object" && value !== null && "type" in value) {
      return (value as { type: CustomField["type"] }).type;
    }
    return "input";
  };

  // Handle fields update
  const handleFieldsUpdate = (updatedFields: CustomField[]) => {
    if (!inputProject) return;

    // Start with the required fields
    const updatedProject: Project = {
      id: inputProject.id,
      lastEdited: new Date().toISOString(),
      name:
        (updatedFields.find((f) => f.id === "field-name")?.value as string) ||
        "",
      description:
        (updatedFields.find((f) => f.id === "field-description")
          ?.value as string) || "",
    };

    // Add any other fields that have values
    updatedFields.forEach((field) => {
      // Skip the required fields and fields without values
      if (
        field.id === "field-name" ||
        field.id === "field-description" ||
        !field.value
      )
        return;

      // Handle different field types appropriately
      const fieldName = field.name.toLowerCase();
      if (field.type === "multiselect" || field.type === "image") {
        // Ensure array values are properly handled
        updatedProject[fieldName] = Array.isArray(field.value)
          ? field.value
          : [];
      } else {
        // For other fields, store as string
        updatedProject[fieldName] = String(field.value);
      }

      // Store field type information
      updatedProject[`${fieldName}_type`] = field.type;
    });

    setInputProject(updatedProject);
    setFields(updatedFields);
  };

  // Save changes
  const handleSave = async () => {
    try {
      setIsSaving(true);
      if (inputProject) {
        await createProject(access_token as string, inputProject);
        setSuccessMsg("Project saved...");
        setSuccess(true);

        if (project) {
          updateProject(inputProject);
        } else {
          addProject(inputProject);
        }

        setTimeout(() => {
          router.push("/dashboard");
        }, 1000);
      }
    } catch (error) {
      console.error("Error saving project:", error);
      setSuccessMsg("Failed to save project");
      setSuccess(false);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDiscard = () => {
    if (project) {
      setInputProject(project);
      // Reset fields to match project
      const projectFields: CustomField[] = [
        {
          id: "field-name",
          name: "Name",
          type: "input" as const,
          value: project.name || "",
        },
        {
          id: "field-description",
          name: "Description",
          type: "input" as const,
          value: project.description || "",
        },
      ];

      // Add any other fields that exist in the project
      Object.entries(project).forEach(([key, value]) => {
        if (
          key !== "id" &&
          key !== "name" &&
          key !== "description" &&
          key !== "lastEdited" &&
          !key.endsWith("_type") &&
          value !== undefined &&
          value !== null
        ) {
          const fieldType = determineFieldType(value);
          projectFields.push({
            id: `field-${key}`,
            name: key.charAt(0).toUpperCase() + key.slice(1),
            type: fieldType,
            value: value,
          });
        }
      });

      setFields(projectFields);
      setDiscardFeedback("Changes discarded");
      setTimeout(() => setDiscardFeedback(null), 2000);
    } else {
      // Reset to empty state for new projects
      const emptyProject = {
        id: id as string,
        lastEdited: new Date().toISOString(),
        name: "",
        description: "",
      };
      setInputProject(emptyProject);
      setFields([
        {
          id: "field-name",
          name: "Name",
          type: "input" as const,
          value: "",
        },
        {
          id: "field-description",
          name: "Description",
          type: "input" as const,
          value: "",
        },
      ]);
      setDiscardFeedback("Project reset to initial state");
      setTimeout(() => setDiscardFeedback(null), 2000);
    }
  };

  return (
    <div className="flex flex-col justify-between flex-1 p-4 w-full">
      <div className="flex flex-col w-full">
        <div className="relative z-[100]">
          <Header projectExist={projectExists} isLoading={isPageLoading} />
        </div>

        {isPageLoading ? (
          <LoadingSpinner size="lg" />
        ) : (
          <>
            {/* Project Info Section */}
            <div
              className={`rounded-lg shadow-sm mb-8 relative z-[1] w-full border ${getPanelClasses(
                isDarkMode
              )}`}
            >
              <div
                className={`p-4 border-b ${getHeaderDividerClasses(
                  isDarkMode
                )}`}
              >
                <h3
                  className={`text-lg font-semibold ${getHeadingClasses(
                    isDarkMode
                  )}`}
                >
                  Project Information
                </h3>
              </div>
              <div className="p-4 grid grid-cols-1 md:grid-cols-2 gap-4">
                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg ${getSecondaryBgClasses(
                    isDarkMode
                  )}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-blue-100">
                      <svg
                        className="w-6 h-6 text-blue-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 20l4-16m2 16l4-16M6 9h14M4 15h14"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${getTextClasses(
                        isDarkMode
                      )}`}
                    >
                      Project ID
                    </p>
                    <p
                      className={`text-sm font-mono truncate ${getTextClasses(
                        isDarkMode
                      )}`}
                    >
                      {projectId}
                    </p>
                  </div>
                </div>

                <div
                  className={`flex items-center space-x-3 p-3 rounded-lg ${getSecondaryBgClasses(
                    isDarkMode
                  )}`}
                >
                  <div className="flex-shrink-0">
                    <div className="w-10 h-10 flex items-center justify-center rounded-full bg-green-100">
                      <svg
                        className="w-6 h-6 text-green-600"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <p
                      className={`text-sm font-medium ${getTextClasses(
                        isDarkMode
                      )}`}
                    >
                      Last Edited
                    </p>
                    <p className={`text-sm ${getTextClasses(isDarkMode)}`}>
                      {project?.lastEdited
                        ? formatDateTime(project.lastEdited)
                        : "Never"}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Fields Section */}
            <div
              className={`${
                isDarkMode
                  ? "bg-gray-900 border-gray-800"
                  : "bg-gray-50 border-gray-200"
              } rounded-lg border-2 mb-8 relative z-[1] w-full`}
            >
              <div className="p-6">
                <h2
                  className={`text-2xl font-bold mb-6 ${
                    isDarkMode ? "text-gray-200" : "text-gray-900"
                  } flex items-center gap-2`}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className={`h-6 w-6 ${
                      isDarkMode ? "text-gray-200" : "text-gray-900"
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6"
                    />
                  </svg>
                  Project Fields
                </h2>
                <p
                  className={`${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  } mb-6`}
                >
                  {projectExists
                    ? "Edit your project fields. You can modify existing fields or add new ones."
                    : "Add fields to your project. You can choose from templates or create your own fields."}
                </p>
                <EditFields fields={fields} onUpdate={handleFieldsUpdate} />
              </div>
            </div>

            {success ? (
              <div className="flex items-center justify-center p-4 mb-8 bg-green-50 border border-green-200 rounded-lg relative z-[1]">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-green-500 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M5 13l4 4L19 7"
                  />
                </svg>
                <span className="text-green-700 text-lg font-medium">
                  {successMsg}
                </span>
              </div>
            ) : (
              <div className="fixed bottom-0 left-0 right-0 bg-white/5 backdrop-blur-sm p-4 z-[90]">
                <div className="max-w-5xl mx-auto flex flex-col sm:flex-row justify-end items-center gap-3">
                  {discardFeedback && (
                    <div className="flex items-center justify-center p-2 bg-blue-50 border border-blue-200 rounded-lg">
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 text-blue-500 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                        />
                      </svg>
                      <span className="text-blue-700 text-sm">
                        {discardFeedback}
                      </span>
                    </div>
                  )}
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <button
                      onClick={handleDiscard}
                      disabled={isSaving || isDeleting || !hasChanges}
                      className={`flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                        hasChanges
                          ? "bg-gray-100 text-gray-700 hover:bg-gray-200 focus:ring-gray-500 border border-gray-300"
                          : "bg-gray-100 text-gray-400 border border-gray-200 cursor-not-allowed"
                      }`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5 mr-2"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Discard Changes
                    </button>
                    <button
                      onClick={handleSave}
                      disabled={isSaving || isDeleting || !hasChanges}
                      className={`flex-1 sm:flex-initial inline-flex items-center justify-center px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors duration-200 ${
                        hasChanges
                          ? "bg-green-600 text-white hover:bg-green-700 focus:ring-green-500 border border-green-600"
                          : "bg-green-400 text-white border border-green-400 cursor-not-allowed"
                      }`}
                    >
                      {isSaving ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Saving...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4"
                            />
                          </svg>
                          Save Changes
                        </>
                      )}
                    </button>
                  </div>
                  {projectExists && (
                    <button
                      onClick={async () => {
                        if (
                          window.confirm(
                            "Are you sure you want to delete this project? This action cannot be undone."
                          )
                        ) {
                          try {
                            setIsDeleting(true);
                            await deleteProject(
                              access_token as string,
                              projectId
                            );
                            removeProject(projectId);
                            router.push("/dashboard");
                          } catch (error) {
                            console.error("Error deleting project:", error);
                            alert("Failed to delete project");
                          } finally {
                            setIsDeleting(false);
                          }
                        }
                      }}
                      disabled={isSaving || isDeleting}
                      className="w-full sm:w-auto inline-flex items-center justify-center px-4 py-2.5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed bg-red-600 text-white hover:bg-red-700 border border-red-600"
                    >
                      {isDeleting ? (
                        <>
                          <svg
                            className="animate-spin -ml-1 mr-2 h-5 w-5 text-white"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          Deleting...
                        </>
                      ) : (
                        <>
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-5 w-5 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                            />
                          </svg>
                          Delete Project
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>
            )}
          </>
        )}
      </div>
      <div className="h-32" />
    </div>
  );
};

export default ProjectPage;
