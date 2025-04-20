import axios from "axios";

const refreshToken = async (refreshToken: string) => {
  const url =
    "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/user/refreshToken";

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${refreshToken}`, // Pass the refresh token in the Authorization header
        },
      }
    );

    return response.data.data;
  } catch (error: unknown) {
    // If it's an Axios error, we can safely access the response
    if (axios.isAxiosError(error) && error.response) {
      // If there's a message in the error response, set that as the error
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message); // Throw error message from the response
      }
    }

    // Throw a general error with a fallback message
    throw new Error("An error occurred during token refresh");
  }
};

export default refreshToken;
