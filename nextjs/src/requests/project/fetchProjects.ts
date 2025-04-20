import apiClient from "../interceptor/apiClient";
import axios from "axios"; // Import axios here

const fetchProjects = async (token: string) => {
  try {
    const response = await apiClient.get("/project/fetch", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Raw response:", response);
    console.log("Response data:", response.data);

    // Handle different response structures
    if (response.data?.data?.projects) {
      return response.data.data.projects;
    } else if (response.data?.projects) {
      return response.data.projects;
    } else if (Array.isArray(response.data)) {
      return response.data;
    }

    // If no valid projects found, return empty array
    return [];
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
