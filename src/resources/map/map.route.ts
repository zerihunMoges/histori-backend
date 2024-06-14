import { Router } from "express";
import { addMap, getMap, getTempMap } from "./map.controller";

const mapRouter = Router();
mapRouter.get("", getMap);
mapRouter.post("", addMap);
mapRouter.get("/temp", getTempMap);

export default mapRouter;
