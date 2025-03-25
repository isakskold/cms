import apiClient from "../interceptor/apiClient";
import axios from "axios"; // Import axios here

const fetchProjects = async (token: string) => {
  try {
    const response = await apiClient.get("/project/fetch", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Projects: ", response.data.data.projects);

    return response.data.data.projects;
  } catch (error: unknown) {
    console.error("Error during projects fetch:", error);

    // Type guard to check if the error is an Axios error
    if (axios.isAxiosError(error) && error.response) {
      // If there's a message in the error response, set that as the error
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message); // Throw error message from the response
      }
    }

    // Throw a general error with a fallback message
    throw new Error("An error occurred during projects fetch");
  }
};

export default fetchProjects;
