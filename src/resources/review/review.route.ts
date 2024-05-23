import { Router } from "express";
import { authenticate, permit } from "../../middlewares/authentication";
import { Role } from "../../utils/roles";
import { createReviews, getReview, getReviews, removeReview, reviewActions, saveHistoryReview, submitHistoryReview } from "./review.controller";

const reviewRouter = Router();

reviewRouter.use(authenticate, permit(Role.Admin, Role.Contributor));

reviewRouter
    .route("/type/:type")
    .get(authenticate, permit(Role.Admin, Role.Contributor), getReviews)


reviewRouter
    .route("/reminders-and-expirations")
    .post(reviewActions);

reviewRouter
    .route("/report/:report_id")
    .post(authenticate, permit(Role.Admin, Role.Contributor), createReviews);

reviewRouter.route("/history/save/:_id").post(authenticate, permit(Role.Admin, Role.Contributor), saveHistoryReview);
reviewRouter.route("/history/submit/:_id").post(authenticate, permit(Role.Admin, Role.Contributor), submitHistoryReview);

reviewRouter
    .route("/:_id")
    .get(authenticate, permit(Role.Admin, Role.Contributor), getReview)
    .delete(authenticate, permit(Role.Admin, Role.Contributor), removeReview);






export default reviewRouter;
