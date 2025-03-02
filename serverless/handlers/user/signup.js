const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
} = require("@aws-sdk/client-dynamodb");
const createResponse = require("../../goodStuffToHave/createResponse");

const client = new DynamoDBClient({ region: "eu-north-1" });

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    if (!event.body) {
      return createResponse(400, "Request body missing");
    }

    const { email, password } = JSON.parse(event.body);
    if (!email || !password) {
      return createResponse(400, "Email and password are required");
    }

    // Check if email already exists by querying the table first
    const checkParams = {
      TableName: "usersTable",
      Key: { email: { S: email } },
      ProjectionExpression: "email",
    };

    const existingUser = await client.send(new GetItemCommand(checkParams));

    if (existingUser.Item) {
      return createResponse(400, "Email is already in use");
    }

    const params = {
      TableName: "usersTable",
      Item: {
        email: { S: email },
        password: { S: password },
        createdAt: { S: new Date().toISOString() },
      },
    };

    await client.send(new PutItemCommand(params));

    return createResponse(201, "User created successfully", { email });
  } catch (error) {
    console.error("Error in signup:", error);
    return createResponse(500, "Internal Server Error", {
      error: error.message,
    });
  }
};
