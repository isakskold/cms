const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");
const createResponse = require("../../goodStuffToHave/createResponse");

const client = new DynamoDBClient({ region: "eu-north-1" });

exports.handler = async (event) => {
  try {
    if (!event.body) {
      return createResponse(400, "Request body missing");
    }

    const { email, project } = JSON.parse(event.body);

    if (!email || !project) {
      return createResponse(400, "Email and project data are required");
    }

    // Validate project data
    const {
      id,
      lastEdited,
      name,
      logo,
      description,
      longDescription,
      skills,
      website,
      github,
      images,
    } = project;

    if (
      !id ||
      !lastEdited ||
      !name ||
      !logo ||
      !description ||
      !longDescription ||
      !Array.isArray(skills) ||
      !Array.isArray(images) ||
      typeof website !== "string" ||
      typeof github !== "string"
    ) {
      return createResponse(400, "Invalid project data format");
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

    // Format the new project to match DynamoDB structure
    const newProject = {
      M: {
        id: { S: id },
        lastEdited: { S: lastEdited },
        name: { S: name },
        logo: { S: logo },
        description: { S: description },
        longDescription: { S: longDescription },
        skills: { L: skills.map((skill) => ({ S: skill })) },
        website: { S: website },
        github: { S: github },
        images: { L: images.map((image) => ({ S: image })) },
      },
    };

    // Update the user's projects list with the new project
    const updateParams = {
      TableName: "usersTable",
      Key: {
        email: { S: email },
      },
      UpdateExpression:
        "SET projects = list_append(if_not_exists(projects, :emptyList), :newProject)",
      ExpressionAttributeValues: {
        ":emptyList": { L: [] }, // Ensures projects is always a list
        ":newProject": { L: [newProject] },
      },
      ReturnValues: "UPDATED_NEW",
    };

    await client.send(new UpdateItemCommand(updateParams));

    return createResponse(201, "Project added successfully to user", {
      email,
      project: newProject,
    });
  } catch (error) {
    console.error("Error in adding project:", error);
    return createResponse(500, "Internal Server Error", {
      error: error.message,
    });
  }
};
