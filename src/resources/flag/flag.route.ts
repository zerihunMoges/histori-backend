import { Router } from "express";
import { authenticate } from "../../middlewares/authentication";
import FlagController from "./flag.controller";

const flagRouter = Router();

flagRouter
    .route("/")
    .post(FlagController.createFlag)
    .get(authenticate, FlagController.getFlagsByCount);

export default flagRouter;
