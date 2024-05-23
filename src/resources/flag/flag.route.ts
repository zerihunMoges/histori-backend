import { Router } from "express";
import { authenticate, permit } from "../../middlewares/authentication";
import { Role } from "../../utils/roles";
import FlagController from "./flag.controller";

const flagRouter = Router();

flagRouter
    .route("/")
    .post(authenticate, permit(Role.Admin, Role.Contributor), FlagController.createFlag)
    .get(authenticate, FlagController.getFlagsByCount);

export default flagRouter;
