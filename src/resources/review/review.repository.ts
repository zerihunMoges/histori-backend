import { ConflictError, InternalError, NotFoundError } from "../../core/ApiError";
import { Report, ReportStatus, ReportType } from "../report/report.model";
import { updateReportStatus } from "../report/report.repository";
import { calculateDueDate, Review } from "./review.model";

export async function populateReview({ review, type }) {
    await review.populate({
        path: "report",
        select: "reason status"
    });

    if (type === ReportType.History) {
        await review.populate("content_id");
    } else if (type === ReportType.Map) {
        await review.populate({
            path: "content_id",
            populate: {
                path: "properties geometry"
            }
        });
    }
}

export async function createReviewRepo({ report_id, reviewer_id }) {
    try {

        const report = await Report.findById(report_id);
        if (!report)
            throw new NotFoundError("There is no report with the specified id");

        if (report.status !== ReportStatus.Open) {
            throw new ConflictError(`This report is already ${report.status} and can not be reviewed again`);
        }

        const review = new Review({
            reviewer: reviewer_id,
            report: report_id,
            content_id: report.content_id,
            type: report.type,
            due_date: calculateDueDate()
        });

        await review.save();

        const updatedReport = await updateReportStatus({ report_id, status: ReportStatus.UnderReview });

        await populateReview({ review, type: report.type });

        return review;
    } catch (error) {
        throw new InternalError(error)
    }
}

export async function getReviewsByTypeRepo({ reviewer_id, type }) {
    try {
        const reviews = await Review.find({ reviewer: reviewer_id, type });

        for (const review of reviews) {
            await populateReview({ review, type: review.type });
        }

        return reviews;
    } catch (error) {
        throw new InternalError(error)
    }
}

export async function getReviewRepo({ _id }) {
    try {
        const review = await Review.findById(_id);

        if (!review)
            throw new NotFoundError("Review not found");

        await populateReview({ review, type: review.type });

        return review;
    } catch (error) {
        throw new InternalError(error)
    }
}

export async function deleteReviewRepo({ _id }) {
    try {
        const review = await Review.findByIdAndDelete(_id);

        if (!review)
            throw new NotFoundError("Review not found");

        await updateReportStatus({ report_id: review.report, status: ReportStatus.Open });

        return review;
    } catch (error) {
        throw new InternalError(error)
    }
}

export async function saveHistoryReviewRepo({ _id, changes, title,
    country,
    start_year,
    end_year,
    summary,
    content,
    categories,
    sources }) {

}