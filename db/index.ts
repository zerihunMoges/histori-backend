import mongoose from "mongoose";
import { config } from "../config";

mongoose.set("strictQuery", true);
mongoose.set("autoIndex", false);

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(config.dataBase, {});

    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}
