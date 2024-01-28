import { Router } from "express";
import { getMap } from "./map.controller";

const mapRouter = Router();
mapRouter.get("", getMap);

export default mapRouter;
