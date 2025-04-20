import axios from "axios";

const exchangeCode = async (code: string) => {
  const tokenUrl = `${process.env.NEXT_PUBLIC_COGNITO_DOMAIN}/oauth2/token`;
  const clientId = process.env.NEXT_PUBLIC_COGNITO_CLIENT_ID as string;
  const redirectUri =
    (process.env.NEXT_PUBLIC_APP_DOMAIN as string) + "/callback";

  const params = new URLSearchParams();
  params.append("grant_type", "authorization_code");
  params.append("client_id", clientId);
  params.append("code", code);
  params.append("redirect_uri", redirectUri);

  try {
    const response = await axios.post(tokenUrl, params, {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error) && error.response) {
      if (error.response.data && error.response.data.error_description) {
        throw new Error(error.response.data.error_description);
      }
    }
    throw new Error("Failed to exchange authorization code");
  }
};

export default exchangeCode;
