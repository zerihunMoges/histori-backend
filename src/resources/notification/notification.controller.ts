import { Request, Response } from 'express';
import { SuccessResponse } from '../../core/ApiResponse';
import { handleErrorResponse } from '../../helpers/errorHandle';
import { NotificationService } from './notification.service';

export default class NotificationController {
    static async getNotifications(req: Request, res: Response) {
        try {
            const user_id = res.locals.user._id;
            const pageNumber = parseInt(req.query.pageNumber ? req.query.pageNumber as string : '1');
            const pageSize = parseInt(req.query.pageSize ? req.query.pageSize as string : '10');

            const notifications = await NotificationService.getNotifications(user_id, pageNumber, pageSize);

            const data = {
                unreadCount: notifications.unreadCount,
                notifications: notifications.notifications
            }

            return new SuccessResponse('Notifications retrieved successfully', data).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }

    static async readNotification(req: Request, res: Response) {
        try {
            const id = req.params.id;

            const notification = await NotificationService.markAsRead(id);

            const data = {
                notification: notification
            }

            return new SuccessResponse('Notification has been read', data).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }

    static async readNotifications(req: Request, res: Response) {
        try {
            const user_id = res.locals.user._id;

            const notifications = await NotificationService.markAllAsRead(user_id);

            const data = {
                notifications: notifications,
                unreadCount: 0
            }

            return new SuccessResponse('Notifications marked as read successfully', data).send(res);
        } catch (error) {
            handleErrorResponse(error, res);
        }
    }
}