const AWS = require("aws-sdk");
const cookie = require("cookie");
require("dotenv").config();
const cognito = new AWS.CognitoIdentityServiceProvider();
const createResponse = require("../../goodStuffToHave/createResponse");

module.exports.handler = async (event) => {
  try {
    console.log("Event: ", event);

    const cookies = cookie.parse(event.cookies?.[0] || "");

    console.log("Cookies: ", cookies);

    const refreshToken = cookies.refreshToken; // Get the refresh token

    if (!refreshToken) {
      return createResponse(400, "Refresh token is not included in cookies");
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
