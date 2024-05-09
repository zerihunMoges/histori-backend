import { InternalError, NotFoundError } from "../../core/ApiError";
import { ReportStatus } from "../report/report.model";
import { updateReportStatus } from "../report/report.repository";
import { Claim } from "./review.model";

export async function deleteClaim({ _id }) {
    try {
        const claim = await Claim.findByIdAndDelete(_id);

        if (!claim)
            throw new NotFoundError("There is no claim made by this user");

        await updateReportStatus({ report_id: claim.report, status: ReportStatus.Open });

        return claim;
    } catch (error) {
        throw new InternalError(error)
    }
}