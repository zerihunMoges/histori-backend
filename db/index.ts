import mongoose from "mongoose";
import { config } from "../config";
import fs from "fs";
import { Map } from "../src/resources/map/map.model";

mongoose.set("strictQuery", true);
mongoose.set("autoIndex", false);

export default async function connectDB() {
  try {
    const conn = await mongoose.connect(config.dataBase, {});

    console.log(`MongoDB Connected: ${conn.connection.host}`);

    // const dir = "C:\\Users\\user\\OneDrive\\Desktop\\Projects\\tempgeojson";
    // const files = fs.readdirSync(dir);
    // // Filter out the files that match the pattern
    // const geojsonFiles = files.filter((file) => true);

    // // Process each matching file
    // for (const file of geojsonFiles) {
    //   // Read the content of the file
    //   const geoJsonContent = fs.readFileSync(`${dir}/${file}`, "utf8");
    //   // Extract the period from the file name
    //   const year = file.split("_")[1];
    //   const periodMatch = year.slice(0, -8);

    //   const period = parseInt(
    //     periodMatch[0] !== "b" ? periodMatch : "-" + periodMatch.slice(2)
    //   );
    //   console.log("saving period ", period);

    //   const map = new Map({
    //     period: period,
    //     geoJson: geoJsonContent,
    //   });
    //   // Save the document to MongoDB Atlas
    //   await map.save();
    //   console.log(`File ${file} processed and saved to the database`);
    // }
  } catch (err: any) {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  }
}
