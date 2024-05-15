import { Router } from "express";
import { authenticate, permit } from "../../middlewares/authentication";
import { Role } from "../../utils/roles";
import { createReviews, getReview, removeReview, reviewActions } from "./review.controller";

const reviewRouter = Router();

reviewRouter.use(authenticate, permit(Role.Admin, Role.Contributor));

reviewRouter
    .route("/")
    .get(authenticate, permit(Role.Admin, Role.Contributor), getReview)
    .delete(authenticate, permit(Role.Admin, Role.Contributor), removeReview);

reviewRouter
    .route("/reminders-and-expirations/")
    .post(reviewActions);


reviewRouter
    .route("/:report_id")
    .post(authenticate, permit(Role.Admin, Role.Contributor), createReviews);

export default reviewRouter;
