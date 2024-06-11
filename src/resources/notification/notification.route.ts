import { Router } from "express";
import { authenticate } from "../../middlewares/authentication";
import NotificationController from "./notification.controller";

const notificationRouter = Router();

notificationRouter
    .route("/")
    .get(authenticate, NotificationController.getNotifications);

notificationRouter
    .route("/read-all")
    .post(authenticate, NotificationController.readNotifications);

notificationRouter
    .route("/:id")
    .post(authenticate, NotificationController.readNotification);

export default notificationRouter;
