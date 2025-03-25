module.exports.handler = async () => {
  try {
    console.log("Invalidating refresh token cookie...");

    // Set the cookie to clear the refresh token
    const headers = {
      "Set-Cookie":
        "refreshToken=; Path=/user/refreshToken; HttpOnly; Secure; SameSite=None; Max-Age=0",
      "Content-Type": "application/json",
    };

    // Return the response with the headers
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        message: "User logged out successfully",
      }),
    };
  } catch (error) {
    console.error("Error during logout: ", error);
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Internal Server Error",
      }),
    };
  }
};
