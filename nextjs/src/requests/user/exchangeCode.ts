import axios from "axios";

const exchangeCode = async (code: string) => {
  const url =
    "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/user/setRefreshToken";

  try {
    const response = await axios.post(url, { code }, { withCredentials: true });

    // You can process the response here if needed
    console.log("Response from API:", response.data);
    return response.data; // Or whatever you need to return from the API
  } catch (error: unknown) {
    // Type guard to check if the error is an AxiosError
    if (axios.isAxiosError(error) && error.response) {
      // If there's a message in the error response, set that as the error
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message); // Throw error message from the response
      }
    }

    // Throw a general error with a fallback message
    throw new Error("An error occurred exchanging code for tokens");
  }
};

export default exchangeCode;
