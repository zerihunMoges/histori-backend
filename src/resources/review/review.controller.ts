import { NextFunction, Request, Response } from "express";
import { ForbiddenError } from "../../core/ApiError";
import { SuccessMsgResponse, SuccessResponse } from "../../core/ApiResponse";
import { handleErrorResponse } from "../../helpers/errorHandle";
import { deleteTempHistoryRepo } from "../history/history.repository";
import { Review } from "./review.model";
import { createReviewRepo, deleteUserReviewRepo, getReviewRepo, getReviewsByTypeRepo, saveHistoryReviewRepo } from "./review.repository";
import { deleteReviewAndNotify } from "./review.service";

export async function createReviews(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const report_id = req.params.report_id;
        const reviewer_id = res.locals.user._id;

        const review = await createReviewRepo({ report_id, reviewer_id });

        return new SuccessResponse("Review Created Successfully", review).send(res);

    } catch (error) {
        handleErrorResponse(error, res);
    }
}

export async function getReviews(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const reviewer_id = res.locals.user._id;
        const type = req.params.type;

        const reviews = await getReviewsByTypeRepo({ reviewer_id, type });

        return new SuccessResponse("Reviews retrieved successfully", reviews).send(res);

    } catch (error) {
        handleErrorResponse(error, res);
    }
}


export async function getReview(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const reviewer_id = res.locals.user._id;
        const _id = req.params._id;

        const review = await getReviewRepo({ _id });

        if (review.reviewer.toString() !== reviewer_id.toString())
            throw new ForbiddenError("You are not authorized to view this review");

        return new SuccessResponse("Review retrieved successfully", review).send(res);

    } catch (error) {
        handleErrorResponse(error, res);
    }
}

export async function removeReview(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const reviewer_id = res.locals.user._id;
        const _id = req.params._id;

        const review = await getReviewRepo({ _id });

        if (review.reviewer.toString() !== reviewer_id.toString())
            throw new ForbiddenError("You are not authorized to view this review");

        const response = await Promise.all([deleteUserReviewRepo({ _id, reviewer_id }), deleteTempHistoryRepo({ _id: reviewer_id })]);

        // const deletedReview = await deleteUserReviewRepo({ _id, reviewer_id });
        // const tempHistory = await deleteTempHistoryRepo({ _id });

        return new SuccessMsgResponse("Review deleted successfully").send(res);

    } catch (error) {
        console.log("Error", error)
        handleErrorResponse(error, res);
    }
}


export async function reviewActions(
    req: Request,
    res: Response,
    next: NextFunction
) {
    try {
        const reviews = await Review.find({}, { _id: 1, due_date: 1, report: 1 });
        const tasks = [];
        const currentDate = new Date();

        reviews.forEach(review => {
            if (currentDate >= review.due_date) {
                tasks.push(deleteReviewAndNotify({ _id: review._id, report_id: review.report }));
            } else if (currentDate < review.due_date) {
                // tasks.push(console.log("Send reminders to Reviewer"));
            }
        })

        await Promise.all(tasks);

        return new SuccessMsgResponse("Review Actions performed successfully").send(res);

    } catch (error) {
        handleErrorResponse(error, res);
    }
}


export async function saveHistoryReview(req: Request,
    res: Response,
    next: NextFunction) {
    try {
        const reviewer_id = res.locals.user._id;
        const _id = req.params._id;

        let {
            changes,
            title,
            country,
            start_year,
            end_year,
            content,
            categories,
            sources
        } = req.body;


        const review = await getReviewRepo({ _id });

        if (review.reviewer.toString() !== reviewer_id.toString())
            throw new ForbiddenError("You are not authorized to view this review");

        const updatedReview = await saveHistoryReviewRepo({ user_id: reviewer_id, _id, changes, title, country, start_year, end_year, content, categories, sources });

        return new SuccessResponse("Review Actions performed successfully", updatedReview).send(res);
    } catch (error) {
        handleErrorResponse(error, res);
    }
}