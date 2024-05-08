import { NextFunction, Request, Response } from "express";
import { Document, Types } from "mongoose";
import { History } from "../history/history.model";
import { IReport, Report, ReportStatus, ReportType } from "./report.model";
import { getHistoryReports } from "./report.repository";


export async function getReports(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let { type, country, categories } = req.query;
    const start_year = req.query.start_year as string;
    const end_year = req.query.end_year as string;

    if (type === undefined || typeof type !== "string" || !(type in ReportType)) {
        return res.status(400).json({ message: "You need to specify a valid type" });
    }

    if (Number.isNaN(parseInt(start_year))) {
        return res.status(400).json({ message: "You need to specify a valid start_year" });
    }

    if (Number.isNaN(parseInt(end_year))) {
        return res.status(400).json({ message: "You need to specify a valid end_year" });
    }

    try {
        let reports: Omit<Document<unknown, {}, IReport> & IReport & { _id: Types.ObjectId; }, never>[];
        switch (type) {
            case ReportType.History:
                reports = await getHistoryReports({ start_year: parseInt(start_year), end_year: parseInt(end_year), country, categories });
                return res.status(200).json(reports);
            default:
                res.status(400).json({ message: "Invalid Type specified" })
        }

        return res.status(500).json({ message: "Server Error" });
    } catch (error) {
        console.error("error is: ", error);
        return res.status(500).json({ message: "Server Error" });
    }
}



export async function createReports(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const reporter_id = res.locals.user._id;

        let {
            content_id,
            type,
            reason
        } = req.body

        switch (type) {
            case ReportType.History:
                const history = await History.find({ _id: content_id });
                if (!history)
                    return res.status(400).json({ message: "There is no history with the specified id" });

        }


        const report = new Report({ reporter_id, content_id, type, reason });

        await report.save();

        const populatedReport = await Report.findById(report._id).populate("content_id");

        res.status(201).json(populatedReport);

    } catch (error) {
        console.error("error is: ", error);
        res.status(500).json({ message: "Server Error" });
    }


}



export async function getReport(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const report = await Report.findById(req.params.id).populate("content_id");

        if (!report)
            return res.status(400).json({ message: "There is no report with the specified id" });

        // Respond
        res.status(200).json(report);
    } catch (error) {
        console.error("error is: ", error);
        res.status(500).json({ message: "Server Error" });
    }
}

export async function updateReport(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let {
        reason
    } = req.body

    try {
        const reporter_id = res.locals.user._id;
        const report = await Report.findById(req.params.id);

        if (!report)
            return res.status(400).json({ message: "There is no report with the specified id" });

        if (report.reporter_id === undefined || report.reporter_id.toString() !== reporter_id.toString()) {
            return res.status(400).json({ message: "You are not authorized to update this report" });
        }

        if (report.status !== ReportStatus.Open) {
            return res.status(400).json({ message: `This report is already  ${report.status} and can not be updated` });
        }

        const updatedReport = await Report.findByIdAndUpdate(req.params.id, { reason }, { new: true }).populate("content_id");

        // Respond
        res.status(200).json(updatedReport);
    } catch (error) {
        console.error("error is: ", error);
        res.status(500).json({ message: "Server Error" });
    }
}


export async function deleteReport(
    req: Request,
    res: Response,
    next: NextFunction
) {
    let {
        reason
    } = req.body

    try {
        const reporter_id = res.locals.user._id;
        const report = await Report.findById(req.params.id);

        if (!report)
            return res.status(400).json({ message: "There is no report with the specified id" });

        if (report.reporter_id === undefined || report.reporter_id.toString() !== reporter_id.toString()) {
            return res.status(400).json({ message: "You are not authorized to delete this report" });
        }

        if (report.status !== ReportStatus.Open) {
            return res.status(400).json({ message: `This report is already  ${report.status} and can not be deleted` });
        }

        const deletedReport = await Report.findByIdAndDelete(req.params.id);

        // Respond
        res.status(200).json({ message: "Report deleted successfully" });
    } catch (error) {
        console.error("error is: ", error);
        res.status(500).json({ message: "Server Error" });
    }
}