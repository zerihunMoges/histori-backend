import { Router } from "express";
import { authenticate, permit } from "../../middlewares/authentication";
import { Role } from "../../utils/roles";
import { createClaims, deleteClaim, getClaim } from "./claim.controller";

const claimRouter = Router();

claimRouter.use(authenticate, permit(Role.Admin, Role.Contributor));

claimRouter
    .route("/")
    .get(getClaim)
    .delete(deleteClaim);

claimRouter
    .route("/:report_id")
    .post(createClaims)
    .get(getClaim);

export default claimRouter;
