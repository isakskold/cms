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

    // Fetch user from DynamoDB
    const params = {
      TableName: "usersTable",
      Key: { email: { S: email } },
    };

    const user = await client.send(new GetItemCommand(params));

    if (!user.Item) {
      return createResponse(401, "Invalid email or password");
    }

    // Check if password matches
    if (user.Item.password.S !== password) {
      return createResponse(401, "Invalid email or password");
    }

    return createResponse(200, "Login successful", { email });
  } catch (error) {
    console.error("Error in signin:", error);
    return createResponse(500, "Internal Server Error", {
      error: error.message,
    });
  }
};
