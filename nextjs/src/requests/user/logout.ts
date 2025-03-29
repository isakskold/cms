import axios from "axios";

const logout = async () => {
  const url =
    "https://ny2wtm2guh.execute-api.eu-north-1.amazonaws.com/user/logout";

  try {
    const response = await axios.post(url, {}, { withCredentials: true });

    console.log("Response from API:", response.data);
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.data && error.response.data.message) {
        throw new Error(error.response.data.message);
      }
    }

    throw new Error("An error occurred while logging out");
  }
};

export default logout;
