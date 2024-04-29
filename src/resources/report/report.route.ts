import { Router } from "express";
import { createReports, deleteReport, getReport, getReports, updateReport } from "./report.controller";

const reportRouter = Router();

reportRouter
    .route("/")
    .get(getReports)
    .post(createReports);

reportRouter
    .route("/:id")
    .get(getReport)
    .patch(updateReport)
    .delete(deleteReport);

export default reportRouter;
