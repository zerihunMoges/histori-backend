import { Router } from "express";
import {
  addMap,
  getMap,
  getMapById,
  getTempMap,
  updateMap,
} from "./map.controller";

const mapRouter = Router();
mapRouter.get("", getMap);
mapRouter.get("/:id", getMapById);
mapRouter.put("", updateMap);
mapRouter.post("", addMap);
mapRouter.get("/temp", getTempMap);

export default mapRouter;
