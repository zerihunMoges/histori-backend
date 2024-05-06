import { Router } from "express";
import { authenticate, permit } from "../../middlewares/authentication";
import { Role } from "../../utils/roles";
import { createClaims, getClaim } from "./claim.controller";

const claimRouter = Router();

claimRouter.use(authenticate, permit(Role.Admin, Role.Contributor));

claimRouter
    .route("/")
    .get(getClaim);

claimRouter
    .route("/:report_id")
    .post(createClaims)
    .get(getClaim);

export default claimRouter;
