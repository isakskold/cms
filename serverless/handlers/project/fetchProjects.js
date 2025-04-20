const { DynamoDBClient, GetItemCommand } = require("@aws-sdk/client-dynamodb");
const createResponse = require("../../goodStuffToHave/createResponse");
const tokenChecker = require("../../goodStuffToHave/tokenChecker"); // Import tokenChecker

const client = new DynamoDBClient({ region: "eu-north-1" });

exports.handler = async (event) => {
  try {
    // Call the tokenChecker function to validate the token
    const email = await tokenChecker(event);

    console.log("email: ", email);

    // Check if user exists
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

    // Retrieve the user's projects and transform them
    const projects = user.Item.projects ? user.Item.projects.L : [];

    const formattedProjects = projects.map((project) => {
      const proj = project.M;
      console.log("Processing project: ", proj);

      // Safe value extraction helper function
      const safeValue = (field, defaultValue = "") => {
        if (!field || !field.S) return defaultValue;
        return field.S;
      };

      // Safe array extraction helper function
      const safeArray = (list) => {
        if (!list || !list.L) return [];
        return list.L.map((item) => item.S);
      };

      // Create a base project with required fields
      const baseProject = {
        id: safeValue(proj.id),
        lastEdited: safeValue(proj.lastEdited),
        name: safeValue(proj.name),
        description: safeValue(proj.description),
      };

      // Process all other fields
      Object.entries(proj).forEach(([key, value]) => {
        // Skip the required fields we've already handled
        if (["id", "lastEdited", "name", "description"].includes(key)) return;

        // Check if this is a type field (ends with _type)
        if (key.endsWith("_type")) {
          const fieldName = key.replace("_type", "");
          const fieldType = safeValue(value);

          // Get the actual field value
          const fieldValue = proj[fieldName];
          if (!fieldValue) return;

          // Handle different field types
          if (fieldType === "multiselect" || fieldType === "image") {
            baseProject[fieldName] = safeArray(fieldValue);
          } else {
            baseProject[fieldName] = safeValue(fieldValue);
          }
          // Store the type information
          baseProject[key] = fieldType;
        }
      });

      return baseProject;
    });

    console.log("Formatted projects: ", formattedProjects);

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
