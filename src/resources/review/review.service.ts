import { InternalError } from "../../core/ApiError";
import { deleteUserReviewRepo } from "./review.repository";

export async function deleteReviewAndNotify({ _id, report_id, reviewer_id }) {
    try {
        const review = await deleteUserReviewRepo({ _id, reviewer_id });

        // Send notification to the user

        return review;
    } catch (error) {
        throw new InternalError(error)
    }
}