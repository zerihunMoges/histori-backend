import { Router } from "express";
import { getMap, getTempMap } from "./map.controller";

const mapRouter = Router();
mapRouter.get("", getMap);
mapRouter.get("/temp", getTempMap);

export default mapRouter;
