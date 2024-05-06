import { InternalError, NotFoundError } from "../../core/ApiError";
import { Report } from "./report.model";

export async function getHistoryReports({ start_year, end_year, country, categories }) {
    try {
        const pipeline: any[] = [
            {
                $lookup: {
                    from: "histories",
                    localField: "content_id",
                    foreignField: "_id",
                    as: "content"
                }
            },
        ];

        const matchStage = {};

        if (country) {
            matchStage["content.country"] = country;
        }

        if (start_year && end_year) {
            matchStage["content.start_year"] = { $gte: start_year };
            matchStage["content.end_year"] = { $lte: end_year };
        }

        if (categories && categories.length > 0) {
            matchStage["content.categories"] = { $in: categories };
        }

        // Add the $match stage if any conditions are specified
        if (Object.keys(matchStage).length > 0) {
            pipeline.push({ $match: matchStage });
        }

        var reports = Report.aggregate(pipeline);

        return reports
    } catch (error) {
        throw new InternalError(error)
    }
}

export async function updateReportStatus({ report_id, status }) {
    try {
        const report = await Report.findOneAndUpdate({ id: report_id }, { status });

        if (!report)
            throw new NotFoundError("There is no report with the specified id");

        return report;
    } catch (error) {
        throw new InternalError(error)
    }
}