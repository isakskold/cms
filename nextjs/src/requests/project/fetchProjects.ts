import apiClient from "../interceptor/apiClient";
import axios from "axios";

const fetchProjects = async (token: string) => {
  try {
    const response = await apiClient.get("/project/fetch", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

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
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }

    throw new Error("An error occurred during projects fetch");
  }
};

export default fetchProjects;
