const Redis = require("ioredis");

const redis = {};

function createClient(key = "client") {
    // Create a Redis client using environment variables
    const redisCient = new Redis({
        host: process.env.REDIS_HOST || "localhost",
        port: process.env.REDIS_PORT || 6379
    });

    redisCient.on("connect", () => {
        redis[key] = redisCient;
        console.log("*** Redis connection successfully created ***");
    });

    redisCient.on("error", (err) => {
        console.error("Redis error", err);
    });
}

function getClient(key) {
    return Object.hasOwn(redis, key) && key ? redis[key] : null;
}

module.exports = { getClient, createClient };
