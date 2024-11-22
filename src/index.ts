import { ConnectOptions, connect } from "mongoose";
import { app } from "./app";
import dotenv from "dotenv";

dotenv.config()

const uri = process.env.MONGODB_URI as string;

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
} as ConnectOptions;

async function run() {
  try {
    await connect(uri, clientOptions);
    
    app.listen(process.env.PORT, () => {
      console.log(`Server is running on port ${process.env.PORT}`);
    });
  } catch (error) {
    console.log(error);
  }
}

run();
