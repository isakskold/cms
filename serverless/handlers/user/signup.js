const AWS = require("aws-sdk");
const { DynamoDBClient, PutItemCommand } = require("@aws-sdk/client-dynamodb"); // Import from AWS SDK v3
const createResponse = require("../../goodStuffToHave/createResponse");

const cognito = new AWS.CognitoIdentityServiceProvider();
const dynamoDB = new DynamoDBClient({ region: "eu-north-1" }); // Use DynamoDBClient from AWS SDK v3

exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));

  try {
    if (!event.body) {
      console.log("Request body missing");
      return createResponse(400, "Request body missing");
    }

    const { email, password } = JSON.parse(event.body);
    if (!email || !password) {
      console.log("Email or password is missing", { email, password });
      return createResponse(400, "Email and password are required");
    }

    console.log("Checking if email exists in Cognito:", email);
    const params = {
      UserPoolId: "eu-north-1_EqPhIcyJw", // Your Cognito User Pool ID
      AttributesToGet: ["email"],
      Filter: `email = "${email}"`, // Filter by email to see if the user already exists
    };

    const existingUser = await cognito.listUsers(params).promise();
    console.log("Cognito listUsers response:", existingUser);

    if (existingUser.Users.length > 0) {
      console.log("Email already in use:", email);
      return createResponse(400, "Email is already in use");
    }

    console.log("Creating user in Cognito:", email);
    const signUpParams = {
      ClientId: "n8b45532or66psvpk57hbq1g9", // Your Cognito App Client ID
      Username: email,
      Password: password,
      UserAttributes: [
        {
          Name: "email",
          Value: email,
        },
      ],
    };

    const signUpResult = await cognito.signUp(signUpParams).promise();
    console.log("Cognito signUp result:", signUpResult);
    const userSub = signUpResult.UserSub; // Get user identifier

    console.log("Storing user in DynamoDB:", email);
    const dynamoParams = {
      TableName: "usersTable", // Your DynamoDB table name
      Item: {
        email: { S: email },
        createdAt: { S: new Date().toISOString() },
        cognitoUserSub: { S: userSub },
        projects: { L: [] }, // Empty list of projects
      },
    };

    await dynamoDB.send(new PutItemCommand(dynamoParams)); // Use PutItemCommand from AWS SDK v3
    console.log("User stored in DynamoDB successfully");

    return createResponse(201, "User created successfully", { email });
  } catch (error) {
    console.error("Error in signup:", error);
    return createResponse(500, "Internal Server Error", {
      error: error.message,
    });
  }
};
