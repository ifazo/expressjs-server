import { ConnectOptions, connect } from "mongoose";
import { app } from "./app";
import { createClient } from "redis";
import dotenv from "dotenv";

dotenv.config();

const port = 8000;

export const redis = createClient();

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
