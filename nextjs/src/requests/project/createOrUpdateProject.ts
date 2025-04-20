import axios from "axios";
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
  } catch (error: unknown) {
    // If it's an Axios error, we can safely access the response
    if (axios.isAxiosError(error) && error.response) {
      // If there's a message in the error response, set that as the error
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message); // Throw error message from the response
      }
    }

    // If there's no specific message, throw a fallback error
    throw new Error("An error occurred during project creation");
  }
};

export default createProject;
