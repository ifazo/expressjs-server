import { ConnectOptions, connect } from "mongoose";
import { app } from "./app";
import dotenv from "dotenv";
import { createClient } from "redis";

dotenv.config();

const port = 8000;

const redisHost = process.env.REDIS_HOST || "localhost";
const redisPort = parseInt(process.env.REDIS_PORT || "6379");

export const redis = createClient({
  url: `redis://${redisHost}:${redisPort}`,
});

redis.on("error", (err) => {
  console.error("Redis Client Error:", err);
});

redis
  .connect()
  .then(() => {
    console.log("Connected to Redis");
  })
  .catch((err) => {
    console.error("Failed to connect to Redis:", err);
  });

const uri = process.env.MONGODB_URI as string;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
} as ConnectOptions;

async function run() {
  try {
    await connect(uri, clientOptions);
    app.listen(port, () => {
      console.log(`express.js server running at: http://localhost:${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

run();
