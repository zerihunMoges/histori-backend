import { Router } from "express";
import { authenticate, permit } from "../../middlewares/authentication";
import { Role } from "../../utils/roles";
import ReportController from "./report.controller";

const reportRouter = Router();

reportRouter
    .route("/")
    .get(authenticate, ReportController.getReports)
    .post(authenticate, permit(Role.Admin, Role.Contributor), ReportController.createReport);

reportRouter
    .route("/:id")
    .get(authenticate, permit(Role.Admin, Role.Contributor), ReportController.getReport)
    .patch(authenticate, permit(Role.Admin, Role.Contributor), ReportController.updateReport)
    .delete(authenticate, permit(Role.Admin, Role.Contributor), ReportController.deleteReport);

export default reportRouter;
