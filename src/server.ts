import mongoose, { ConnectOptions } from "mongoose";
import { app } from "./app";
import config from "./config";

const uri = config.mongodb_uri as string;

const clientOptions = { serverApi: { version: '1', strict: true, deprecationErrors: true } } as ConnectOptions;

async function run() {
  try {
    await mongoose.connect(uri, clientOptions);
    
    app.listen(config.port, () => {
      console.log(`Server is running on port ${config.port}`);
    });

  } catch (error) {
    console.log(error);
  }
}

run()

