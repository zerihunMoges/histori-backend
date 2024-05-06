import { NextFunction, Request, Response } from "express";
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
            return res.status(400).json({ message: "There is no report with the specified id" });

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

        const populatedClaim = await Claim.findById(claim._id).populate({
            path: 'report',
            options: { lean: true } // Retrieve plain JavaScript objects instead of Mongoose documents
        });

        res.status(201).json(populatedClaim);

    } catch (error) {
        console.error("error is: ", error);
        res.status(500).json({ message: "Server Error" });
    }


}