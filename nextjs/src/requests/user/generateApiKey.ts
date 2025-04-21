import apiClient from "../interceptor/apiClient";

const generateApiKey = async (token: string) => {
  try {
    const response = await apiClient.post(
      "/user/generateApiKey",
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data.message.apiKey;
  } catch (error) {
    console.error("API Key generation error:", error);
    throw new Error(
      error instanceof Error
        ? `Failed to generate API key: ${error.message}`
        : "Failed to generate API key"
    );
  }
};

export default generateApiKey;
