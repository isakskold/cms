exports.handler = async (event) => {
  console.log("Received event:", JSON.stringify(event));
  try {
    if (!event.body) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Request body missing",
        }),
      };
    }

    const { email, password } = JSON.parse(event.body);

    // Basic validation for email and password
    if (!email || !password) {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: "Email and password are required",
        }),
      };
    }

    // Here, you would typically add logic to create the user in your database
    // For example, saving to DynamoDB, checking if the email already exists, etc.

    // Mock success message
    return {
      statusCode: 201,
      body: JSON.stringify({
        message: "Signup successful",
        user: { email }, // Return the email of the created user (for example)
      }),
    };
  } catch (error) {
    console.error("Error in signup:", error);

    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
        error: error.message, // Log the error message here
        stack: error.stack,
      }),
    };
  }
};
