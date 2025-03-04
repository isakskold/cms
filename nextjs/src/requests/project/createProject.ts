import axios from "axios";
import { Project } from "@/types/data/project";

const createProject = async (email: string, project: Project) => {
  const url =
    "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/project/create";

  try {
    const response = await axios.post(url, {
      email,
      project,
    });

    return response.data;
  } catch (error: any) {
    console.error("Error during project creation:", error);

    // If there's a message in the error response, set that as the error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message); // Throw error message from the response
    }

    // Throw a general error with a fallback message
    throw new Error("An error occurred during sign in");
  }
};

export default createProject;
