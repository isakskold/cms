const AWS = require("aws-sdk");
require("dotenv").config();
const cognito = new AWS.CognitoIdentityServiceProvider();
const createResponse = require("../../goodStuffToHave/createResponse");

module.exports.handler = async (event) => {
  try {
    console.log("Event: ", event);

    // Extract the refresh token from the event body (or query params)
    const refreshToken = event.headers["authorization"]?.split(" ")[1];

    if (!refreshToken) {
      console.error("Refresh token error:", error);

      return createResponse(
        400,
        "Refresh token is required in the Authorization header"
      );
    }

    // Define parameters for Cognito's InitiateAuth or AdminInitiateAuth
    const params = {
      AuthFlow: "REFRESH_TOKEN_AUTH",
      ClientId: process.env.COGNITO_CLIENT_ID,
      AuthParameters: {
        REFRESH_TOKEN: refreshToken,
      },
    };

    // Call Cognito to get a new access token
    const result = await cognito.initiateAuth(params).promise();

    // Return the tokens using createResponse
    return createResponse(200, "Token refreshed successfully", {
      accessToken: result.AuthenticationResult.AccessToken,
      refreshToken: result.AuthenticationResult.RefreshToken,
      idToken: result.AuthenticationResult.IdToken,
      tokenType: result.AuthenticationResult.TokenType || "Bearer", // Defaults to "Bearer" if not present
      expiresIn: result.AuthenticationResult.ExpiresIn || 3600, // Defaults to 3600 if not present
    });
  } catch (error) {
    console.error("Error refreshing token: ", error);

    // Check if the error is related to invalid refresh token
    if (
      error.code === "NotAuthorizedException" ||
      error.code === "InvalidParameterException"
    ) {
      return createResponse(401, "Invalid refresh token");
    }

    return createResponse(500, "Internal Server Error");
  }
};
