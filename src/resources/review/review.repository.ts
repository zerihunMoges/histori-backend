import { ConflictError, ForbiddenError, NotFoundError } from "../../core/ApiError";
import { NotificationContentType } from "../../types/notification";
import { createTempHistoryRepo, deleteTempHistoryRepo, getTempHistoryRepo, updateHistoryRepo, updateTempHistoryRepo } from "../history/history.repository";
import { NotificationService } from "../notification/notification.service";
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

        const sendNotification = NotificationService.createNotification(report.reporter_id.toString(), `A report you made is under review`, NotificationContentType.report, report_id);

        const updatedReport = updateReportStatus({ report_id, status: ReportStatus.UnderReview });

        const [_, __] = await Promise.all([sendNotification, updatedReport]);
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

        const delete_temp_history = deleteTempHistoryRepo({ _id: reviewer_id })
        const delete_review = Review.findByIdAndDelete(_id)
        const update_report_status = updateReportStatus({ report_id: review.report, status: ReportStatus.Open })

        const [_, __, updated_report] = await Promise.all([delete_temp_history, delete_review, update_report_status]);

        const sendNotification = await NotificationService.createNotification(updated_report.reporter_id.toString(), `A report you made has been reopened`, NotificationContentType.report, updated_report._id.toString());

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

        const review = await Review.findByIdAndUpdate(_id, { changes, temp_history_id: temp_history._id, status: ReviewStatus.Approved }, { new: true })
        const deletedHistoryTask = deleteTempHistoryRepo({ _id: user_id });
        const updatedReportTask = updateReportStatus({ report_id: review.report, status: ReportStatus.Closed });
        const updatedHistoryTask = updateHistoryRepo({ _id, title: temp_history.title, country: temp_history.country, start_year: temp_history.start_year, end_year: temp_history.end_year, content: temp_history.content, categories: temp_history.categories, sources: temp_history.sources });


        const [_, updatedReport, __] = await Promise.all([deletedHistoryTask, updatedReportTask, updatedHistoryTask]);

        const sendNotification = await NotificationService.createNotification(updatedReport.reporter_id.toString(), `A report you made has been reviewed`, NotificationContentType.report, updatedReport._id.toString());

        await populateReview({ review: review, type: ReportType.History });

        return review;
    } catch (error) {
        throw error;
    }
}