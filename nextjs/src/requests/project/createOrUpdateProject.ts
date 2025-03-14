import apiClient from "../interceptor/apiClient";
import { Project } from "@/types/data/project";

const createProject = async (token: string, project: Project) => {
  try {
    const response = await apiClient.post("/project/create", project, {
      headers: {
        Authorization: `Bearer ${token}`, // Use the token in the Authorization header
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error during project creation:", error);

    // If there's a message in the error response, set that as the error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message); // Throw error message from the response
    }

    // Throw a general error with a fallback message
    throw new Error("An error occurred during project creation");
  }
};

export default createProject;
