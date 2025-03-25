import axios from "axios";

const signInUser = async (email: string, password: string) => {
  const url =
    "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/user/signin";

  try {
    const response = await axios.post(url, {
      email,
      password,
    });

    return response.data; // Returns the response data from the API
  } catch (error: unknown) {
    // Log the error for debugging purposes
    console.error("Error during sign in:", error);

    // If it's an Axios error, we can safely access the response
    if (axios.isAxiosError(error) && error.response) {
      // If there's a message in the error response, set that as the error
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message); // Throw error message from the response
      }
    }

    // Throw a general error with a fallback message
    throw new Error("An error occurred during sign in");
  }
};

export default signInUser;
