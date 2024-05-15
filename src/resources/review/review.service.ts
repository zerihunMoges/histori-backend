import { InternalError } from "../../core/ApiError";
import { deleteReviewRepo } from "./review.repository";

export async function deleteReviewAndNotify({ _id, report_id }) {
    try {
        const review = await deleteReviewRepo({ _id });

        // Send notification to the user

        return review;
    } catch (error) {
        throw new InternalError(error)
    }
}