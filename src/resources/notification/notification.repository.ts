import { NotificationModel } from './notification.model';

export class NotificationRepository {
    static async createMsgNotification(user_id: string, message: string) {
        const date = new Date();
        return await NotificationModel.create({ user_id, message, created_at: date });
    }

    static async createNotification(user_id: string, message: string, content_type: string, content: string) {
        const date = new Date();
        return await NotificationModel.create({ user_id, message, content, content_type, created_at: date });
    }

    static async getNotifications(user_id: string, pageNumber: number, pageSize: number) {
        const [unreadCount, notifications] = await Promise.all([NotificationModel.countDocuments({ user_id, isRead: false }), NotificationModel.find({ user_id }).limit(pageSize).skip((pageNumber - 1) * pageSize).sort({ created_at: -1 })])
        return { notifications, unreadCount };
    }

    static async getNotification(id: string) {
        return await NotificationModel.findById(id);
    }

    static async markAsRead(id: string) {
        return await NotificationModel.findByIdAndUpdate(id, { isRead: true }, { new: true });
    }

    static async markAllAsRead(user_id: string) {
        return await NotificationModel.updateMany({ user_id, isRead: false }, { isRead: true });
    }
}