const Redis = require("ioredis");

// Create a Redis client to connect to ElastiCache
const redis = new Redis({
  host: "cms-cache-xxvbyx.serverless.eun1.cache.amazonaws.com", // Your Redis endpoint
  port: 6379, // Default Redis port
  tls: true, // Enabling TLS if your ElastiCache is using encryption
});

/**
 * Middleware function to clear the cache for a specific key.
 * @param {string} email - The email to identify the cache to clear.
 * @throws {Error} - Throws an error if something goes wrong.
 */
const clearCache = async (email) => {
  try {
    if (!email) {
      throw new Error("Email is missing");
    }

    // Ensure the key format is consistent
    const cacheKey = `user:${email}`; // Adjust this based on your key format

    // Log the cache key for debugging
    console.log("Deleting cache for key:", cacheKey);

    // Delete the cache item for the user from ElastiCache
    const deleteResponse = await redis.del(cacheKey); // Deletes the key based on the email

    if (deleteResponse === 0) {
      throw new Error("No cache found for the given email.");
    }

    // Log the cache deletion response
    console.log("Cache deleted successfully for email:", email);
  } catch (error) {
    console.error("Error clearing cache:", error);
    throw new Error("Internal Server Error: " + error.message);
  }
};

module.exports = clearCache;
