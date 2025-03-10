const { jwtDecode } = require("jwt-decode");
const AWS = require("aws-sdk");
const cognito = new AWS.CognitoIdentityServiceProvider();
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

    // Extract the token from the Authorization header
    const token = event.headers["authorization"].split(" ")[1]; // Assuming Bearer token

    if (!token) {
      throw new Error("Authorization token is missing");
    }

    // Decode the token (using 'jwt-decode' package)
    const decoded = jwtDecode(token);

    // Extract the sub (user ID) from the decoded token
    const userId = decoded.sub; // The "sub" field in the token is the user ID

    // Fetch the email from the Cognito User Pool using the user ID
    const getUserDetailsFromCognito = async (sub) => {
      const params = {
        UserPoolId: "eu-north-1_EqPhIcyJw",
        AttributesToGet: ["email", "sub"], // Specify the attributes to retrieve
        Limit: 1, // Limit to 1 user
        Filter: `sub = "${sub}"`, // Filter by the sub value you want to match
      };
      console.log("Attempting to access cognito user using sub: ", sub);

      try {
        // Fetch the list of users based on sub
        const result = await cognito.listUsers(params).promise();

        if (result.Users && result.Users.length > 0) {
          // If the user is found, extract the email
          const user = result.Users[0];
          console.log("User found: ", user);

          // Extract the email attribute inside the try block
          const emailAttr = user.Attributes.find(
            (attr) => attr.Name === "email"
          );
          return emailAttr ? emailAttr.Value : null;
        } else {
          console.log("No user found with the provided sub.");
          return null;
        }
      } catch (error) {
        console.log("Error fetching user details: ", error);
        return null;
      }
    };

    // Get the email from Cognito using the userId (sub)
    const email = await getUserDetailsFromCognito(userId);

    if (!email) {
      throw new Error("Email not found in the Cognito User Pool");
    }

    // Log the query being sent to DynamoDB
    console.log("Querying DynamoDB with email from token: ", email);

    // Query DynamoDB to check if the user exists
    const user = await client.send(
      new GetItemCommand({
        TableName: "usersTable",
        Key: { email: { S: email } },
      })
    );

    // Log the result from DynamoDB
    console.log("DynamoDB response: ", user);

    // If the user doesn't exist, return an error
    if (!user.Item) {
      throw new Error(
        "Token verified, but no user found on userTable matching provided email"
      );
    }

    // If valid, return the email (or any relevant user info if needed)
    return email;
  } catch (error) {
    console.error("Error checking token validity:", error);
    throw new Error("Internal Server Error: " + error.message);
  }
};

module.exports = tokenChecker;
