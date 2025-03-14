const createResponse = require("../../goodStuffToHave/createResponse");
require("dotenv").config();
const COGNITO_DOMAIN = process.env.COGNITO_DOMAIN;
const CLIENT_ID = process.env.COGNITO_CLIENT_ID;
const REDIRECT_URI = process.env.COGNITO_REDIRECT_URI;

module.exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const code = body.code;

    if (!code) {
      return createResponse(400, "Authorization code is required");
    }

    // Exchange authorization code for tokens
    const response = await fetch(`${COGNITO_DOMAIN}/oauth2/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        grant_type: "authorization_code",
        code: code,
        redirect_uri: REDIRECT_URI,
        client_id: CLIENT_ID,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      console.error("Error from Cognito:", errorBody);
      return createResponse(400, "Failed to exchange authorization code");
    }

    const data = await response.json();
    console.log("Tokens received:", data);

    // Set the refresh token as an HttpOnly, Secure cookie
    return {
      statusCode: 200,
      headers: {
        "Set-Cookie": `refreshToken=${data.refresh_token}; Path=/user/refreshToken; HttpOnly; Secure; SameSite=None`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        message: "Refresh token set successfully",
        access_token: data.access_token,
      }),
    };
  } catch (error) {
    console.error(error);

    return createResponse(500, "Internal server error");
  }
};
