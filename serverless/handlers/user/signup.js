const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "eu-north-1" });

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Request body missing" }),
      };
    }

    const { email, password } = JSON.parse(event.body);
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Email and password are required" }),
      };
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

    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "User created successfully",
        user: { email },
      }),
    };
  } catch (error) {
    console.error("Error in signup:", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message,
      }),
    };
  }
};
