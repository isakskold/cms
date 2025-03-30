const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const createResponse = require("../../goodStuffToHave/createResponse");

const client = new DynamoDBClient({ region: "eu-north-1" });

exports.handler = async (event) => {
  try {
    // Extract API key and email from request headers
    const apiKey = event.headers["x-api-key"] || event.headers["X-API-Key"];
    const email = event.headers["x-user-email"]; // Email is now passed as a custom header

    if (!apiKey) {
      return createResponse(400, "API key is required");
    }

    if (!email) {
      return createResponse(400, "Email is required");
    }

    // Check if user exists in DynamoDB based on the email tied to the API key
    const user = await client.send(
      new GetItemCommand({
        TableName: "usersTable",
        Key: { email: { S: email } },
      })
    );

    console.log("Checked user with email: ", user);

    if (!user.Item) {
      return createResponse(404, "User not found");
    }

    // Compare the provided API key with the stored one
    const storedApiKey = user.Item.apiKey.S;

    if (apiKey !== storedApiKey) {
      return createResponse(401, "API key does not match");
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
