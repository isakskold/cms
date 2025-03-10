const {
  DynamoDBClient,
  GetItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const createResponse = require("../../goodStuffToHave/createResponse");
const tokenChecker = require("../../goodStuffToHave/tokenChecker");

const client = new DynamoDBClient({ region: "eu-north-1" });

exports.handler = async (event) => {
  try {
    // Call the tokenChecker function to validate the token
    const email = await tokenChecker(event);

    const projectId = event.pathParameters.id;

    console.log("Project id from path param: ", projectId);

    // Get the user's data to find the project index
    const getParams = {
      TableName: "usersTable",
      Key: {
        email: { S: email },
      },
    };

    const userResult = await client.send(new GetItemCommand(getParams));

    if (!userResult.Item || !userResult.Item.projects) {
      return createResponse(404, "User or projects not found");
    }

    const projects = userResult.Item.projects.L;
    const projectIndex = projects.findIndex(
      (project) => project.M.id.S === projectId
    );

    if (projectIndex === -1) {
      return createResponse(404, "Project not found");
    }

    // Now that we have the index, we can perform the update
    const updateParams = {
      TableName: "usersTable",
      Key: { email: { S: email } },
      UpdateExpression: "REMOVE projects[" + projectIndex + "]", // Remove by index
      ReturnValues: "ALL_NEW",
    };

    const result = await client.send(new UpdateItemCommand(updateParams));

    if (!result.Attributes) {
      return createResponse(404, "Project not found");
    }

    return createResponse(200, "Project deletion was successfully");
  } catch (error) {
    console.error("Error in deleting project:", error);
    return createResponse(500, "Internal Server Error", {
      error: error.message,
    });
  }
};
