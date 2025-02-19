import { ConnectOptions, connect } from "mongoose";
import { app } from "./app";
import dotenv from "dotenv";

dotenv.config()

const uri = process.env.MONGODB_URI as string;
const port = 3000

const clientOptions = {
  serverApi: { version: "1", strict: true, deprecationErrors: true },
} as ConnectOptions;

async function run() {
  try {
    await connect(uri, clientOptions);
    
    app.listen(port, () => {
      console.log(`Expressjs Server is running on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

run();
