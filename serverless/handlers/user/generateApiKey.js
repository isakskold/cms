const { DynamoDB } = require("aws-sdk");
const { v4: uuidv4 } = require("uuid");
const dynamoDb = new DynamoDB.DocumentClient();
const tokenChecker = require("../../goodStuffToHave/tokenChecker");
const createResponse = require("../../goodStuffToHave/createResponse");

exports.handler = async (event) => {
  try {
    // Validate the token and get the user's email
    const email = await tokenChecker(event);
    if (email.statusCode) {
      // If tokenChecker returned an error response
      return email;
    }

    // Generate a new API key
    const apiKey = uuidv4();

    // Update the user's record in DynamoDB
    const params = {
      TableName: "usersTable",
      Key: { email },
      UpdateExpression: "SET apiKey = :apiKey",
      ExpressionAttributeValues: {
        ":apiKey": apiKey,
      },
      ReturnValues: "ALL_NEW",
    };

    const result = await dynamoDb.update(params).promise();

    return createResponse(200, {
      success: true,
      apiKey,
    });
  } catch (error) {
    console.error("Error generating API key:", error);
    return createResponse(500, {
      success: false,
      error: "Failed to generate API key",
    });
  }
};
