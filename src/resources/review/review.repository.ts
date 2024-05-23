import { ConflictError, ForbiddenError, NotFoundError } from "../../core/ApiError";
import { createTempHistoryRepo, deleteTempHistoryRepo, getTempHistoryRepo, updateTempHistoryRepo } from "../history/history.repository";
import { Report, ReportStatus, ReportType } from "../report/report.model";
import { updateReportStatus } from "../report/report.repository";
import { calculateDueDate, Review, ReviewStatus } from "./review.model";

export async function populateReview({ review, type }) {
    await review.populate({
        path: "report",
        select: "reason status"
    });

    if (type === ReportType.History) {
        await review.populate("content_id temp_history_id");
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
        throw error
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
        throw error;
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
        throw error
    }
}

export async function deleteUserReviewRepo({ _id, reviewer_id }) {
    try {
        const review = await Review.findById(_id);

        if (!review)
            throw new NotFoundError("Review not found");

        if (reviewer_id.toString() !== review.reviewer.toString())
            throw new ForbiddenError("You are not authorized to delete this review");

        // const del =  await deleteTempHistoryRepo({ _id: reviewer_id });
        // const deleted_review = await Review.findByIdAndDelete(_id);

        // await updateReportStatus({ report_id: review.report, status: ReportStatus.Open });


        await Promise.all([deleteTempHistoryRepo({ _id: reviewer_id }), Review.findByIdAndDelete(_id), updateReportStatus({ report_id: review.report, status: ReportStatus.Open })]);

        return review;
    } catch (error) {
        throw error;
    }
}

export async function saveHistoryReviewRepo({
    user_id,
    _id,
    changes,
    title,
    country,
    start_year,
    end_year,
    content,
    categories,
    sources }) {
    try {
        const temp_history_exists = await getTempHistoryRepo({ _id: user_id });

        let temp_history;

        if (!temp_history_exists) {
            temp_history = await createTempHistoryRepo({ _id: user_id, title, country, start_year, end_year, content, categories, sources });
        } else {
            temp_history = await updateTempHistoryRepo({ _id: user_id, title, country, start_year, end_year, content, categories, sources });
        }

        const saved_review = await Review.findByIdAndUpdate(_id, { changes, temp_history_id: temp_history._id }, { new: true });

        await populateReview({ review: saved_review, type: ReportType.History });

        return saved_review;
    } catch (error) {
        throw error;
    }
}

export async function submitHistoryReviewRepo({
    user_id,
    _id,
    changes,
    title,
    country,
    start_year,
    end_year,
    content,
    categories,
    sources }) {
    try {
        const temp_history_exists = await getTempHistoryRepo({ _id: user_id });

        let temp_history;

        if (!temp_history_exists) {
            temp_history = await createTempHistoryRepo({ _id: user_id, title, country, start_year, end_year, content, categories, sources });
        } else {
            temp_history = await updateTempHistoryRepo({ _id: user_id, title, country, start_year, end_year, content, categories, sources });
        }

        const [saved_review, deletedHistory] = await Promise.all([Review.findByIdAndUpdate(_id, { changes, temp_history_id: temp_history._id, status: ReviewStatus.Approved }, { new: true }), deleteTempHistoryRepo({ _id: user_id })]);

        await populateReview({ review: saved_review, type: ReportType.History });

        return saved_review;
    } catch (error) {
        throw error;
    }
}