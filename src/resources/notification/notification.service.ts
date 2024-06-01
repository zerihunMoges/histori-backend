import { NotificationRepository } from './notification.repository';

export class NotificationService {
    static async createMsgNotification(user_id: string, message: string) {
        return await NotificationRepository.createMsgNotification(user_id, message);
    }

    static async createNotification(user_id: string, message: string, content_type: string, content: string) {
        return await NotificationRepository.createNotification(user_id, message, content_type, content);
    }

    static async getNotifications(user_id: string, pageNumber: number, pageSize: number) {
        return await NotificationRepository.getNotifications(user_id, pageNumber, pageSize);
    }

    static async getNotification(id: string) {
        return await NotificationRepository.getNotification(id);
    }

    static async markAsRead(id: string) {
        return await NotificationRepository.markAsRead(id);
    }

    static async markAllAsRead(user_id: string) {
        return await NotificationRepository.markAllAsRead(user_id);
    }
}