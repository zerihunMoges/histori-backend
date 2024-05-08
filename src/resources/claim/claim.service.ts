import { InternalError } from "../../core/ApiError";
import { deleteClaim } from "./claim.repository";

export async function deleteClaimAndNotify({ _id, report_id }) {
    try {
        const claim = await deleteClaim({ _id });

        // Send notification to the user

        return claim;
    } catch (error) {
        throw new InternalError(error)
    }
}