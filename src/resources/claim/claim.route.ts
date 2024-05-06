import { Router } from "express";
import { authenticate, permit } from "../../middlewares/authentication";
import { Role } from "../../utils/roles";
import { createClaims } from "./claim.controller";

const claimRouter = Router();

claimRouter
    .route("/:report_id")
    .post(authenticate, permit(Role.Admin, Role.Contributor), createClaims);

export default claimRouter;
