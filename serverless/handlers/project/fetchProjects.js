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
      console.log("Processing project: ", proj); // Add logging to see the raw data

      // Safe array extraction helper function
      const safeArray = (list) => {
        if (!list || !list.L) return [];
        return list.L.map((item) => item.S);
      };

      // Parse field value safely
      const parseFieldValue = (field) => {
        if (field.M.type.S === "multiselect") {
          return safeArray(field.M.value);
        } else {
          const strValue = field.M.value.S;
          // Try to parse JSON if it looks like it
          if (
            strValue &&
            (strValue.startsWith("{") || strValue.startsWith("["))
          ) {
            try {
              return JSON.parse(strValue);
            } catch (e) {
              return strValue;
            }
          }
          return strValue;
        }
      };

      // Initialize customFields as an empty array if it doesn't exist
      const customFields =
        proj.customFields && proj.customFields.L
          ? proj.customFields.L.map((field) => ({
              id: field.M.id.S,
              name: field.M.name.S,
              type: field.M.type.S,
              value: parseFieldValue(field),
            }))
          : [];

      console.log("Processed customFields: ", customFields); // Add logging to see the processed data

      return {
        id: proj.id.S,
        lastEdited: proj.lastEdited.S,
        name: proj.name.S,
        logo: proj.logo.S,
        description: proj.description.S,
        longDescription: proj.longDescription.S,
        skills: safeArray(proj.skills),
        website: proj.website.S,
        github: proj.github.S,
        images: safeArray(proj.images),
        customFields: customFields,
      };
    });

    console.log("Formatted projects: ", formattedProjects); // Add logging to see the final data

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
