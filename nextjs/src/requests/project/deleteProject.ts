import axios from "axios";

const deleteProject = async (token: string, projectId: string) => {
  const url = `https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/project/${projectId}`;

  try {
    const response = await axios.delete(url, {
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
