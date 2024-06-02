import { Request, Response } from 'express';
import { ForbiddenError, NotFoundError } from '../../core/ApiError';
import { SuccessResponse } from '../../core/ApiResponse';
import { handleErrorResponse } from '../../helpers/errorHandle';
import { ReportStatus, ReportType } from '../../types/report';
import { History } from '../history/history.model';
import { ReportService } from './report.service';

export default class ReportController {
    static async createReport(req: Request, res: Response) {
        try {
            const reporter_id = res.locals.user._id;
            const isPopulated = true;

            let {
                content_id,
                title,
                type,
                reason
            } = req.body

            if (type == ReportType.history) {
                const history = await History.find({ _id: content_id });
                if (!history)
                    throw new NotFoundError("There is no history with the specified id");
            } else if (type == ReportType.map) {
                console.log("Report for map invoked for type ", type)
                throw new NotFoundError(`Report for type: ${ReportType.map} is not currently supported`)
            } else {
                console.log("Report for map invoked for type ", type)
                throw new NotFoundError(`Report for type: ${type} is not currently supported`)
            }

            const report = await ReportService.createReport(reporter_id, title, content_id, type, reason, isPopulated);

            const data = {
                report: report
            }

            return new SuccessResponse('Report created successfully', data).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }

    static async getReports(req: Request, res: Response) {
        try {
            const reporter_id = res.locals.user._id;

            const { type } = req.query;
            const country = req.query.country as string;
            const category = req.query.category as string;
            const start_year = req.query.start_year as string;
            const end_year = req.query.end_year as string;

            let reports

            if (type == ReportType.history) {
                reports = await ReportService.getHistoryReports(reporter_id, country as string, category as string, start_year, end_year);
            } else if (type == ReportType.map) {
                console.log("Report for map invoked for type ", type)
                throw new NotFoundError(`Report for type: ${ReportType.map} is not currently supported`)
            } else {
                console.log("Report for map invoked for type ", type)
                throw new NotFoundError(`Report for type: ${type} is not currently supported`)
            }

            const data = {
                reports: reports
            }

            return new SuccessResponse('Reports retrieved successfully', data).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }

    static async getReport(req: Request, res: Response) {
        try {
            const id = req.params.id;
            const isPopulated = true;

            const report = await ReportService.getReport(id, isPopulated);

            const data = {
                report: report
            }

            return new SuccessResponse('Report retrieved successfully', data).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }

    static async updateReport(req: Request, res: Response) {
        try {
            let {
                title,
                reason
            } = req.body
            const reporter_id = res.locals.user._id;
            const id = req.params.id;
            const report = await ReportService.getReport(id);
            const isPopulated = true;

            if (!report)
                throw new NotFoundError("There is no report with the specified id")

            if (report.reporter_id === undefined || report.reporter_id.toString() !== reporter_id.toString()) {
                throw new ForbiddenError("You are not authorized to update this report")
            }

            if (report.status !== ReportStatus.open) {
                throw new ForbiddenError(`This report is already  ${report.status} and can not be updated`)
            }

            const updated_report = await ReportService.updateReport(id, title, reason, isPopulated)

            const data = {
                report: updated_report
            }

            return new SuccessResponse('Report updated successfully', data).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }

    static async deleteReport(req: Request, res: Response) {
        try {
            const reporter_id = res.locals.user._id;
            const id = req.params.id;
            const report = await ReportService.getReport(id);
            const isPopulated = true

            if (!report)
                throw new NotFoundError("There is no report with the specified id")

            if (report.reporter_id === undefined || report.reporter_id.toString() !== reporter_id.toString()) {
                throw new ForbiddenError("You are not authorized to update this report")
            }

            if (report.status !== ReportStatus.open) {
                throw new ForbiddenError(`This report is already  ${report.status} and can not be updated`)
            }

            const updated_report = await ReportService.deleteReport(id, isPopulated)

            const data = {
                report: updated_report
            }

            return new SuccessResponse('Report deleted successfully', data).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }
}