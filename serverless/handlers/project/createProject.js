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

    // Destructure project after validation with joi
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
      (proj) => proj.M.id.S === id
    );

    if (projectIndex !== -1) {
      // Update the existing project
      const updatedProject = {
        M: {
          id: { S: id },
          lastEdited: { S: new Date().toISOString() }, // Ensure lastEdited is updated
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

      // Update the project in the user's list of projects
      existingProjects[projectIndex] = updatedProject; // Modify the existing project

      const updateParams = {
        TableName: "usersTable",
        Key: { email: { S: email } },
        UpdateExpression: "SET projects = :updatedProjects",
        ExpressionAttributeValues: {
          ":updatedProjects": { L: existingProjects }, // Set the entire updated list
        },
        ReturnValues: "UPDATED_NEW",
      };

      await client.send(new UpdateItemCommand(updateParams));

      return createResponse(200, "Project updated successfully", {
        email,
        project: updatedProject,
      });
    } else {
      // Append the new project if it doesn't exist
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

      const updateParams = {
        TableName: "usersTable",
        Key: { email: { S: email } },
        UpdateExpression:
          "SET projects = list_append(if_not_exists(projects, :emptyList), :newProject)",
        ExpressionAttributeValues: {
          ":emptyList": { L: [] },
          ":newProject": { L: [newProject] },
        },
        ReturnValues: "UPDATED_NEW",
      };

      await client.send(new UpdateItemCommand(updateParams));

      return createResponse(201, "Project added successfully to user", {
        email,
        project: newProject,
      });
    }
  } catch (error) {
    console.error("Error in adding/updating project:", error);
    return createResponse(500, "Internal Server Error", {
      error: error.message,
    });
  }
};
