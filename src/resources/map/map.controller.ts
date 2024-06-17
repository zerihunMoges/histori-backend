import { NextFunction, Request, Response } from "express";
import NodeCache from "node-cache";
import { Geometry, Map, Properties, TempMap } from "./map.model";
const cache = new NodeCache({
  deleteOnExpire: true,
  maxKeys: 100,
  stdTTL: 600,
});

// Function to fetch map data from the database or cache
async function fetchMapData(year) {
  const cacheKey = `map:${year}`;

  // Check if data is cached
  const cachedData = cache.get(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData as string);
  }

  // If data is not cached, fetch it from the database
  const mapData = await Map.find({
    $or: [
      { startPeriod: { $lte: year }, endPeriod: { $gte: year } },
      { startPeriod: { $lte: year }, endPeriod: null },
    ],
  })
    .populate("properties")
    .populate("geometry");

  // Cache the data for future requests
  cache.set(cacheKey, JSON.stringify(mapData));

  return mapData;
}

// Express route handler
export async function getMap(req, res, next) {
  const { period } = req.query;

  try {
    if (typeof period !== "string") {
      return res.status(400).json({ message: "Invalid period parameter" });
    }

    const year = parseInt(period);
    if (isNaN(year)) {
      return res.status(400).json({ message: "Invalid period parameter" });
    }

    // Fetch map data from cache or database
    const mapData = await fetchMapData(year);

    return res
      .status(200)
      .json({ type: "FeatureCollection", name: year, features: mapData });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

// Express route handler
export async function getMapById(req, res, next) {
  const id = req.params.id;

  try {
    const mapData = await Map.findById(id)
      .populate("properties")
      .populate("geometry");
    if (!mapData) {
      return res.status(404).json({ message: "Map not found" });
    }

    return res.status(200).json(mapData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function getTempMap(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { period } = req.query;

  try {
    if (typeof period !== "string") {
      return res.status(400).json({ message: "invalid period parameter" });
    }
    let targetYear: number | null;
    const year = parseInt(period as string);
    if (isNaN(year)) {
      return res.status(400).json({ message: "Invalid period parameter" });
    }
    const cacheKey = `tmap:${year}`;

    // Check if data is cached
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(JSON.parse(cachedData as string));
    }

    // If data is not cached, fetch it from the database
    const mapData = await TempMap.findOne({
      $or: [
        { startPeriod: { $lte: year }, endPeriod: { $gte: year } },
        { startPeriod: { $lte: year }, endPeriod: null || undefined },
      ],
    });

    // Cache the data for future requests
    cache.set(cacheKey, JSON.stringify(mapData));

    return res.status(200).json(mapData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
  }
}

export async function addMap(req: Request, res: Response, next: NextFunction) {
  try {
    const { startPeriod, endPeriod, map } = req.body;

    if (!startPeriod || !Number.isInteger(startPeriod)) {
      return res.status(400).json({
        message: "startPeriod must be a valid integer (year, can be negative)",
      });
    }

    if (
      endPeriod &&
      (!Number.isInteger(endPeriod) || endPeriod < startPeriod)
    ) {
      return res.status(400).json({
        message: "endPeriod must be a integer greater than startPeriod",
      });
    }
    // Ensure map field exists
    if (!map) {
      return res.status(400).json({ message: "Missing required map field" });
    }

    // Extract properties and geometry from the map
    const { properties, geometry } = map;
    if (!properties.NAME) {
      return res.status(400).json({ message: "Missing required NAME" });
    }
    if (!geometry.coordinates?.length) {
      return res.status(400).json({ message: "Missing required geometry" });
    }
    // Save properties to the database
    const newProperties = new Properties({
      NAME: properties.NAME,
      ABBREVN: properties.ABBREVN,
      SUBJECTO: properties.SUBJECTO,
      BORDERPRECISION: properties.BORDERPRECISION,
      PARTOF: properties.PARTOF,
    });
    const savedProperties = await newProperties.save();

    // Save geometry to the database
    const newGeometry = new Geometry({
      type: geometry.type,
      coordinates: geometry.coordinates,
    });
    const savedGeometry = await newGeometry.save();

    // Create and save the new map
    const newMap = new Map({
      type: map.type || "Feature",
      startPeriod: startPeriod,
      endPeriod: endPeriod,
      properties: savedProperties._id,
      geometry: savedGeometry._id,
    });
    const savedMap = await newMap.save();

    return res.status(201).json(savedMap);
  } catch (error) {
    next(error);
  }
}

export async function updateMap(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { id, startPeriod, endPeriod, map } = req.body;

    if (!id) {
      return res.status(400).json({ message: "Missing required id field" });
    }

    if (!startPeriod || !Number.isInteger(startPeriod)) {
      return res.status(400).json({
        message: "startPeriod must be a valid integer (year, can be negative)",
      });
    }

    if (
      endPeriod &&
      (!Number.isInteger(endPeriod) || endPeriod < startPeriod)
    ) {
      return res.status(400).json({
        message: "endPeriod must be a integer greater than startPeriod",
      });
    }
    // Ensure map field exists
    if (!map) {
      return res.status(400).json({ message: "Missing required map field" });
    }

    // Extract properties and geometry from the map
    const { properties, geometry } = map;
    if (!properties.NAME) {
      return res.status(400).json({ message: "Missing required NAME" });
    }
    if (!geometry.coordinates?.length) {
      return res.status(400).json({ message: "Missing required geometry" });
    }
    // Save properties to the database
    const newProperties = new Properties({
      NAME: properties.NAME,
      ABBREVN: properties.ABBREVN,
      SUBJECTO: properties.SUBJECTO,
      BORDERPRECISION: properties.BORDERPRECISION,
      PARTOF: properties.PARTOF,
    });
    const savedProperties = await newProperties.save();

    // Save geometry to the database
    const newGeometry = new Geometry({
      type: geometry.type,
      coordinates: geometry.coordinates,
    });
    const savedGeometry = await newGeometry.save();

    // Create and save the new map
    const savedMap = Map.findByIdAndUpdate(
      id,
      {
        type: map.type || "Feature",
        startPeriod: startPeriod,
        endPeriod: endPeriod,
        properties: savedProperties._id,
        geometry: savedGeometry._id,
      },
      { new: true }
    );

    if (!savedMap) {
      return res.status(404).json({ message: "Map not found" });
    }

    return res.status(201).json(savedMap);
  } catch (error) {
    next(error);
  }
}

function findClosestPeriod(target: number, periods: number[]) {
  // Binary search for the closest period
  let left = 0;
  let right = periods.length - 1;
  let closestPeriod: number | null = null;

  while (left <= right) {
    const mid = Math.floor((left + right) / 2);

    if (periods[mid] === target) {
      closestPeriod = periods[mid];
      break;
    } else if (periods[mid] < target) {
      if (
        closestPeriod === null ||
        Math.abs(closestPeriod - target) > Math.abs(periods[mid] - target)
      )
        closestPeriod = periods[mid];
      left = mid + 1;
    } else {
      if (
        closestPeriod === null ||
        Math.abs(closestPeriod - target) > Math.abs(periods[mid] - target)
      )
        closestPeriod = periods[mid];
      right = mid - 1;
    }
  }
  return closestPeriod;
}
