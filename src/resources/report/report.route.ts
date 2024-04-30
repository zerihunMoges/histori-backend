import { Router } from "express";
import { authenticate, permit } from "../../middlewares/authentication";
import { Role } from "../../utils/roles";
import { createReports, deleteReport, getReport, getReports, updateReport } from "./report.controller";

const reportRouter = Router();

reportRouter
    .route("/")
    .get(authenticate, getReports)
    .post(authenticate, permit(Role.Admin, Role.Contributor), createReports);

reportRouter
    .route("/:id")
    .get(authenticate, permit(Role.Admin, Role.Contributor), getReport)
    .patch(authenticate, permit(Role.Admin, Role.Contributor), updateReport)
    .delete(authenticate, permit(Role.Admin, Role.Contributor), deleteReport);

export default reportRouter;
