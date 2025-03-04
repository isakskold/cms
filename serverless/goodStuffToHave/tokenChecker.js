const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const createResponse = require("./createResponse");

const client = new DynamoDBClient({ region: "eu-north-1" });

/**
 * Utility function to check if the token (email) exists in the database.
 * @param {object} event - The event containing the request headers.
 * @returns {Promise<string | object>} - Returns the email if valid or an error response if invalid.
 */
const tokenChecker = async (event) => {
  try {
    console.log("Event headers: ", event.headers);

    // Check if Authorization header is present
    const token = event.headers["x-custom-authorization"];
    if (!token) {
      return createResponse(400, "x-custom-authorization header is missing");
    }

    console.log("Token: ", token);

    if (!token) {
      throw new Error("Authorization header is missing");
    }

    // Query the DynamoDB to check if the user exists
    const user = await client.send(
      new GetItemCommand({
        TableName: "usersTable",
        Key: { email: { S: token } },
      })
    );

    // If the user doesn't exist, return an error
    if (!user.Item) {
      throw new Error("Invalid or expired token");
    }

    // If valid, return the email (or any relevant user info if needed)
    return token;
  } catch (error) {
    console.error("Error checking token validity:", error);
    throw new Error("Internal Server Error: " + error.message);
  }
};

module.exports = tokenChecker;
