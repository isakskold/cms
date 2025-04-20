const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const createResponse = require("../../goodStuffToHave/createResponse");
const tokenChecker = require("../../goodStuffToHave/tokenChecker");
const { projectSchema } = require("../../goodStuffToHave/joi/projectSchema");

const client = new DynamoDBClient({ region: "eu-north-1" });

// Helper function to convert any value to DynamoDB format
const toDynamoDBValue = (value) => {
  if (Array.isArray(value)) {
    return { L: value.map((item) => toDynamoDBValue(item)) };
  } else if (typeof value === "object" && value !== null) {
    return {
      M: Object.entries(value).reduce((acc, [key, val]) => {
        acc[key] = toDynamoDBValue(val);
        return acc;
      }, {}),
    };
  } else if (typeof value === "string") {
    return { S: value };
  } else if (typeof value === "number") {
    return { N: value.toString() };
  } else if (typeof value === "boolean") {
    return { BOOL: value };
  } else {
    return { S: JSON.stringify(value) };
  }
};

exports.handler = async (event) => {
  try {
    // Call the tokenChecker function to validate the token
    const email = await tokenChecker(event);

    console.log("email: ", email);

    if (!event.body) {
      return createResponse(400, "Request body missing");
    }

    const project = JSON.parse(event.body);

    // Validate the project object with JOI
    const { error } = projectSchema.validate(project);
    if (error) {
      return createResponse(
        400,
        `Invalid project data: ${error.details
          .map((d) => d.message)
          .join(", ")}`
      );
    }

    // Check if user exists
    const user = await client.send(
      new GetItemCommand({
        TableName: "usersTable",
        Key: { email: { S: email } },
      })
    );

    if (!user.Item) {
      return createResponse(404, "User not found");
    }

    // Get the user's current projects list
    const existingProjects = user.Item.projects ? user.Item.projects.L : [];

    // Find the index of the project with the same id
    const projectIndex = existingProjects.findIndex(
      (proj) => proj.M.id.S === project.id
    );

    // Convert the project to DynamoDB format
    const dynamoProject = {
      M: Object.entries(project).reduce((acc, [key, value]) => {
        acc[key] = toDynamoDBValue(value);
        return acc;
      }, {}),
    };

    if (projectIndex !== -1) {
      // Update the existing project
      existingProjects[projectIndex] = dynamoProject;

      const updateParams = {
        TableName: "usersTable",
        Key: { email: { S: email } },
        UpdateExpression: "SET projects = :updatedProjects",
        ExpressionAttributeValues: {
          ":updatedProjects": { L: existingProjects },
        },
        ReturnValues: "UPDATED_NEW",
      };

      await client.send(new UpdateItemCommand(updateParams));

      return createResponse(200, "Project updated successfully", {
        email,
        project: dynamoProject,
      });
    } else {
      // Append the new project if it doesn't exist
      const updateParams = {
        TableName: "usersTable",
        Key: { email: { S: email } },
        UpdateExpression:
          "SET projects = list_append(if_not_exists(projects, :emptyList), :newProject)",
        ExpressionAttributeValues: {
          ":emptyList": { L: [] },
          ":newProject": { L: [dynamoProject] },
        },
        ReturnValues: "UPDATED_NEW",
      };

      await client.send(new UpdateItemCommand(updateParams));

      return createResponse(201, "Project added successfully to user", {
        email,
        project: dynamoProject,
      });
    }
  } catch (error) {
    console.error("Error in adding/updating project:", error);
    return createResponse(500, "Internal Server Error", {
      error: error.message,
    });
  }
};
