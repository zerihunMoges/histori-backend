import { Router } from "express";
import { authenticate, permit } from "../../middlewares/authentication";
import { Role } from "../../utils/roles";
import { claimActions, createClaims, getClaim, removeClaim } from "./claim.controller";

const claimRouter = Router();

claimRouter.use(authenticate, permit(Role.Admin, Role.Contributor));

claimRouter
    .route("/")
    .get(authenticate, permit(Role.Admin, Role.Contributor), getClaim)
    .delete(authenticate, permit(Role.Admin, Role.Contributor), removeClaim);

claimRouter
    .route("/reminders-and-expirations/")
    .post(claimActions);


claimRouter
    .route("/:report_id")
    .post(authenticate, permit(Role.Admin, Role.Contributor), createClaims);

export default claimRouter;
