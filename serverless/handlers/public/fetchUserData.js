const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const createResponse = require("../../goodStuffToHave/createResponse");

const client = new DynamoDBClient({ region: "eu-north-1" });

exports.handler = async (event) => {
  console.log(
    "=== VERSION 2.0 - Enhanced project handling with detailed logging ==="
  );

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

    // Log the raw projects array structure
    console.log("Projects array type:", typeof projects);
    console.log("Projects array length:", projects.length);
    console.log(
      "First project structure:",
      JSON.stringify(projects[0], null, 2)
    );

    const formattedProjects = projects
      .map((project, index) => {
        console.log(
          `Processing project ${index}:`,
          JSON.stringify(project, null, 2)
        );

        if (!project || typeof project !== "object") {
          console.warn(
            `Invalid project entry at index ${index}:`,
            JSON.stringify(project, null, 2)
          );
          return null;
        }

        if (!project.M) {
          console.warn(
            `Malformed project entry at index ${index} (no .M):`,
            JSON.stringify(project, null, 2)
          );
          return null;
        }

        const proj = project.M;
        if (!proj || typeof proj !== "object") {
          console.warn(
            `Project.M is invalid at index ${index}:`,
            JSON.stringify(project, null, 2)
          );
          return null;
        }

        // Log the structure of the project.M object
        console.log(
          `Project ${index} .M structure:`,
          JSON.stringify(proj, null, 2)
        );

        // Safely access all properties with optional chaining and nullish coalescing
        const projectData = {
          id: proj.id?.S ?? "",
          lastEdited: proj.lastEdited?.S ?? "",
          name: proj.name?.S ?? "",
          description: proj.description?.S ?? "",
        };

        // Ensure required fields are present
        if (
          !projectData.id ||
          !projectData.lastEdited ||
          !projectData.name ||
          !projectData.description
        ) {
          console.warn(`Project at index ${index} is missing required fields`);
          return null;
        }

        // Add all other fields from the database as they are
        Object.entries(proj).forEach(([key, value]) => {
          if (!["id", "lastEdited", "name", "description"].includes(key)) {
            if (value.L) {
              projectData[key] = value.L.map((item) => item?.S ?? "").filter(
                Boolean
              );
            } else if (value.S) {
              projectData[key] = value.S;
            }
          }
        });

        return projectData;
      })
      .filter(Boolean); // remove nulls

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
