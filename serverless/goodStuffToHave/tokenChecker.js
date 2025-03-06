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
      throw new Error("Authorization header is missing");
    }

    // Log the query being sent to DynamoDB
    console.log("Querying DynamoDB with token: ", token);

    // Query the DynamoDB to check if the user exists
    const user = await client.send(
      new GetItemCommand({
        TableName: "usersTable",
        Key: { email: { S: token } },
      })
    );

    // Log the result from DynamoDB
    console.log("DynamoDB response: ", user);

    // If the user doesn't exist, return an error
    if (!user.Item) {
      throw new Error("Invalid or expired token");
    }

    console.log("User verified");

    // If valid, return the email (or any relevant user info if needed)
    return token;
  } catch (error) {
    console.error("Error checking token validity:", error);
    throw new Error("Internal Server Error: " + error.message);
  }
};

module.exports = tokenChecker;
