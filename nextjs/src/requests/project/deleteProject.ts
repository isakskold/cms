import apiClient from "../interceptor/apiClient";
import axios from "axios"; // Import axios here

const deleteProject = async (token: string, projectId: string) => {
  try {
    const response = await apiClient.delete(`/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response;
  } catch (error: unknown) {
    // Type guard to check if the error is an Axios error
    if (axios.isAxiosError(error) && error.response) {
      // If there's a message in the error response, set that as the error
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message); // Throw error message from the response
      }
    }

    // Throw a general error with a fallback message
    throw new Error("An error occurred during project deletion");
  }
};

export default deleteProject;
