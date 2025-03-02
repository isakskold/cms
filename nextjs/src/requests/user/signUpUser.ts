import axios from "axios";

const signUpUser = async (email: string, password: string) => {
  const url =
    "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/user/signup";

  try {
    const response = await axios.post(url, {
      email,
      password,
    });

    return response.data; // Returns the response data from the API
  } catch (error: any) {
    console.error("Error during signup:", error);

    // If there's a message in the error response, set that as the error
    if (error.response && error.response.data && error.response.data.message) {
      throw new Error(error.response.data.message); // Throw error message from the response
    }

    // If there's no specific message, throw a fallback error
    throw new Error("An error occurred during signup");
  }
};

export default signUpUser;
