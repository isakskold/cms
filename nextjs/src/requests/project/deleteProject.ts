import apiClient from "../interceptor/apiClient";

const deleteProject = async (token: string, projectId: string) => {
  try {
    const response = await apiClient.delete(`/project/${projectId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log("Project deleted successfully:", response.data);
    return response;
  } catch (error: any) {
    console.error("Error during project deletion:", error);

    // If there's a message in the error response, set that as the error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message); // Throw error message from the response
    }

    // Throw a general error with a fallback message
    throw new Error("An error occurred during project deletion");
  }
};

export default deleteProject;
