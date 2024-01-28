import { Request, Response, NextFunction } from "express";
import { Map } from "./map.model";
import NodeCache from "node-cache";
const cache = new NodeCache({
  maxKeys: 100,
});

export async function getMap(req: Request, res: Response, next: NextFunction) {
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

    const cachedPeriod: number = cache.get(`period ${year}`);

    if (cachedPeriod) {
      console.log("got year from cache");
      targetYear = cachedPeriod;
    } else {
      const periods = await Map.find()
        .select("period")
        .then((periods) => periods.map((period) => period.period));

      periods.sort((a, b) => a - b);
      const targetPeriod = findClosestPeriod(year, periods);
      targetYear = targetPeriod;

      cache.set(`period ${year}`, targetYear, 10000);
    }

    const cachedData = cache.get(`map ${targetYear}`);
    if (cachedData) {
      console.log("got year from cache");
      return res.status(200).json(cachedData);
    }

    const mapData = await Map.findOne({ period: targetYear });

    cache.set(`map ${targetYear}`, mapData, 10000);

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
