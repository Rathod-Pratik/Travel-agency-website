import { createClient } from "redis";
import IORedis from "ioredis";
export const redis = createClient({
    url: process.env.REDIS_URL || "redis://localhost:6379",
});

redis.on("error", (err) => {
    console.error("Redis Error:", err);
});

export const connectRedis = async () => {
    await redis.connect();
    console.log("Redis connected");
};

export const bellmqConnection = new IORedis(
  process.env.REDIS_URL!,
  {
    maxRetriesPerRequest: null,
  }
);