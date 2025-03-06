const Redis = require("ioredis");

let redis; // Declare redis outside the function to reuse it

async function connectRedis() {
  if (redis) {
    console.log("Redis is already connected, reusing the connection.");
    return redis; // Return existing connection if already connected
  }

  try {
    console.log("Attempting to connect to Redis...");

    redis = new Redis({
      host: "cms-cache-xxvbyx.serverless.eun1.cache.amazonaws.com", // ElastiCache endpoint
      port: 6379, // Default Redis port
      tls: true,
    });

    // Attach event listeners for various Redis events
    redis.on("connect", () => {
      console.log("Redis connected.");
    });

    redis.on("ready", () => {
      console.log("Redis connection is ready.");
    });

    redis.on("error", (err) => {
      console.error("Redis error:", err);
    });

    redis.on("close", () => {
      console.log("Redis connection closed.");
    });

    redis.on("reconnecting", () => {
      console.log("Redis reconnecting...");
    });

    // Ping to check connection
    await redis.ping();
    console.log("Redis connection established successfully.");
  } catch (error) {
    console.error("Error connecting to Redis:", error);
    throw new Error("Failed to connect to Redis.");
  }

  return redis; // Return the Redis client
}

module.exports = { connectRedis };
