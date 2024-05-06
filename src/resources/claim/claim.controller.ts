import { NextFunction, Request, Response } from "express";
import { NotFoundError } from "../../core/ApiError";
import { SuccessResponse } from "../../core/ApiResponse";
import { handleErrorResponse } from "../../helpers/errorHandle";
import { Report, ReportStatus } from "../report/report.model";
import { updateReportStatus } from "../report/report.repository";
import { Claim, calculateDueDate } from "./claim.model";

export async function createClaims(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const report_id = req.params.report_id;
        const claimer_id = res.locals.user._id;

        const report = await Report.findById(report_id);
        if (!report)
            throw new NotFoundError("There is no report with the specified id");

        if (report.status !== ReportStatus.Open) {
            return res.status(400).json({ message: `This report is already ${report.status} and can not be claimed` });
        }

        const claim = new Claim({
            _id: claimer_id,
            claimer: claimer_id,
            report: report_id,
            due_date: calculateDueDate()
        });

        await claim.save();

        const updatedReport = await updateReportStatus({ report_id, status: ReportStatus.Claimed });

        const populatedClaim = await Claim.findById(claim._id).populate('report').lean().exec();

        res.status(201).json(populatedClaim);

    } catch (error) {
        handleErrorResponse(error, res);
    }
}


export async function getClaim(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const claimer_id = res.locals.user._id;

        const claim = await Claim.findById(claimer_id).populate("report").lean().exec();

        return new SuccessResponse("Claim retrieved successfully", claim).send(res);

    } catch (error) {
        handleErrorResponse(error, res);
    }
}