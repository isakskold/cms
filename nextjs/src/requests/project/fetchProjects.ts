import axios from "axios";

const fetchProjects = async (token: string) => {
  const url =
    "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/project/fetch";

  try {
    const response = await axios.get(url, {
      headers: {
        "x-custom-authorization": token, // Just send the token directly without the "Bearer" prefix
      },
    });
    console.log("Projects: ", response.data.data.projects);

    return response.data.data.projects;
  } catch (error: any) {
    console.error("Error during projects fetch:", error);

    // If there's a message in the error response, set that as the error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message); // Throw error message from the response
    }
    throw new Error("An error occurred during projects fetch");
  }
};

export default fetchProjects;
