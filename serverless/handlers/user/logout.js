const createResponse = require("../../goodStuffToHave/createResponse");

module.exports.handler = async () => {
  try {
    console.log("Invalidating refresh token cookie...");

    // Create a response to clear the refresh token cookie
    const headers = {
      "Set-Cookie":
        "refreshToken=; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=0",
    };

    return createResponse(200, "User logged out successfully", null, headers);
  } catch (error) {
    console.error("Error during logout: ", error);
    return createResponse(500, "Internal Server Error");
  }
};
