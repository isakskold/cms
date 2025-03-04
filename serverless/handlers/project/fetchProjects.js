const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const createResponse = require("../../goodStuffToHave/createResponse");
const tokenChecker = require("../../goodStuffToHave/tokenChecker"); // Import tokenChecker

const client = new DynamoDBClient({ region: "eu-north-1" });

exports.handler = async (event) => {
  try {
    // Call the tokenChecker function to validate the token
    const tokenOrError = await tokenChecker(event);

    // Proceed with the logic assuming tokenOrError contains the valid email
    const email = tokenOrError;

    console.log("email: ", email);

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

    // Retrieve the user's projects and transform them
    const projects = user.Item.projects ? user.Item.projects.L : [];

    const formattedProjects = projects.map((project) => {
      const proj = project.M;
      return {
        id: proj.id.S,
        lastEdited: proj.lastEdited.S,
        name: proj.name.S,
        logo: proj.logo.S,
        description: proj.description.S,
        longDescription: proj.longDescription.S,
        skills: proj.skills.L.map((skill) => skill.S), // Convert skill list
        website: proj.website.S,
        github: proj.github.S,
        images: proj.images.L.map((image) => image.S), // Convert image list
      };
    });

    return createResponse(200, "User's projects retrieved successfully", {
      email,
      projects: formattedProjects,
    });
  } catch (error) {
    console.error("Error in fetching user's projects:", error);
    return createResponse(500, "Internal Server Error", {
      error: error.message,
    });
  }
};
