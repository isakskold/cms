const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");
const crypto = require("crypto");

const dynamoDB = new DynamoDBClient({ region: "eu-north-1" });

exports.handler = async (event) => {
  console.log("Received Cognito trigger event:", JSON.stringify(event));

  try {
    const { sub, email } = event.request.userAttributes;

    // Generate a random API key (e.g., 32 bytes, encoded in hex)
    const apiKey = crypto.randomBytes(32).toString("hex");

    console.log("Creating user in DynamoDB:", email);
    const dynamoParams = {
      TableName: "usersTable",
      Item: {
        email: { S: email },
        createdAt: { S: new Date().toISOString() },
        cognitoUserSub: { S: sub },
        apiKey: { S: apiKey },
        projects: { L: [] },
      },
    };

    await dynamoDB.send(new PutItemCommand(dynamoParams));
    console.log("User stored in DynamoDB successfully");

    return event; // Always return event for Cognito triggers
  } catch (error) {
    console.error("Error storing user in DynamoDB:", error);
    throw new Error("DynamoDB storage failed");
  }
};
