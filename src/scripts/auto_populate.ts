import mongoose from "mongoose";
import fs from "fs";
import { NextFunction, Request, Response, Router } from "express";
import { Geometry, Map, Properties } from "../resources/map/map.model";
import path from "path";

async function autoPopulateMaps(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const folder_path =
    "C:\\Users\\user\\Downloads\\historical-basemaps-master (3)\\historical-basemaps-master\\geojson";
  const geojsonFile = "your_geojson_file.geojson";
  //   const geojson = JSON.parse(fs.readFileSync(geojsonFile, "utf8"));
  const files = fs.readdirSync(folder_path as string);

  // Map years to file names
  const yearToFileMap = {};
  files.forEach((fileName) => {
    const yearMatch = fileName.match(/_(bc)?(\d+)\.geojson/);

    if (yearMatch) {
      let year = parseInt(yearMatch[2]);
      if (yearMatch[1] === "bc") year = -year;

      yearToFileMap[year] = fileName;
    }
  });

  // Sort years
  const sortedYears = Object.keys(yearToFileMap)
    .map(Number)
    .sort((a, b) => a - b);

  // Process each file
  for (const year of sortedYears) {
    const fileName = yearToFileMap[year];
    const filePath = path.join(folder_path as string, fileName);
    const startYear = year;
    const endYear = sortedYears[sortedYears.indexOf(year) + 1];

    await processGeoJSONFile(filePath, startYear, endYear);
  }
  return res.status(200).json(sortedYears);
  //   geojson.features.forEach(async (feature) => {
  //     try {
  //       if (feature.properties.NAME === null) return;
  //       // Update or create Properties document
  //       const properties = await Properties.findOneAndUpdate(
  //         { NAME: feature.properties.NAME },
  //         feature.properties,
  //         { upsert: true, new: true }
  //       );

  //       // Create Geometry document
  //       const geometry = await Geometry.create(feature.geometry);

  //       // Create Map document
  //       const map = await Map.create({
  //         startPeriod: 100,
  //         endPeriod: 100,
  //         properties: properties._id,
  //         geometry: geometry._id,
  //       });

  //       console.log(`Map created: ${map}`);
  //     } catch (error) {
  //       console.error(`Error creating map: ${error}`);
  //     }
  //   });
}
async function processGeoJSONFile(filePath, startYear, endYear) {
  try {
    // Read GeoJSON file
    const geojson = JSON.parse(fs.readFileSync(filePath, "utf8"));

    // Process each feature in the GeoJSON
    for (const feature of geojson.features) {
      // Update or create Properties document
      const properties = await Properties.create(feature.properties);

      // Create Geometry document
      const geometry = await Geometry.create(feature.geometry);

      // Create Map document
      await Map.create({
        startPeriod: startYear,
        endPeriod: endYear,
        properties: properties._id,
        geometry: geometry._id,
      });

      console.log(`Map created for ${startYear}-${endYear}`);
    }
  } catch (error) {
    console.error(`Error processing GeoJSON file ${filePath}: ${error}`);
  }
}

const scriptRouter = Router();
scriptRouter.post("/maps", autoPopulateMaps);

export default scriptRouter;
