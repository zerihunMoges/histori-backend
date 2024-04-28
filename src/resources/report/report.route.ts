import { Router } from "express";
import { authenticate, permit } from "../../middlewares/authentication";
import { Role } from "../../utils/roles";
import { createReports, getReport, getReports } from "./report.controller";

const reportRouter = Router();

reportRouter
    .route("/")
    .get(getReports)
    .post(authenticate, permit(Role.Admin, Role.Contributor), createReports);

reportRouter
    .route("/:id")
    .get(getReport);

export default reportRouter;
