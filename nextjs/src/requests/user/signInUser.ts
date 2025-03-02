import axios from "axios";

const signInUser = async (email: string, password: string) => {
  const url =
    "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/user/signIn";

  try {
    const response = await axios.post(url, {
      email,
      password,
    });

    return response.data; // Returns the response data from the API
  } catch (error) {
    // Log the error for debugging purposes
    console.error("Error during sign in:", error);

    // Throw a general error with a fallback message
    throw new Error("An error occurred during sign in");
  }
};

export default signInUser;
