import { Request, Response, NextFunction } from "express";
import { Map, TempMap } from "./map.model";
import NodeCache from "node-cache";
import { Redis } from "ioredis";
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

    console.log("Request for year:", year);

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

export async function getTempMap(
  req: Request,
  res: Response,
  next: NextFunction
) {
  let { period } = req.query;

  try {
    console.log("request for ", period);
    if (typeof period !== "string") {
      return res.status(400).json({ message: "invalid period parameter" });
    }
    let targetYear: number | null;
    const year = parseInt(period as string);
    if (isNaN(year)) {
      return res.status(400).json({ message: "Invalid period parameter" });
    }
    const cacheKey = `map:${year}`;

    // Check if data is cached
    const cachedData = cache.get(cacheKey);
    if (cachedData) {
      return res.status(200).json(cachedData);
    }

    // If data is not cached, fetch it from the database
    const mapData = await TempMap.findOne({
      $or: [
        { startPeriod: { $lte: year }, endPeriod: { $gte: year } },
        { startPeriod: { $lte: year }, endPeriod: null || undefined },
      ],
    });

    // Cache the data for future requests
    cache.set(cacheKey, mapData);

    return res.status(200).json(mapData);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
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
