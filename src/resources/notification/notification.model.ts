import mongoose from "mongoose";
import { NotificationContentType } from "../../types/notification";
export interface INotification {
    user_id: mongoose.Types.ObjectId;
    message: string;
    content_type: string;
    content: mongoose.Types.ObjectId;
    created_at: Date;
    isRead: boolean;
}

const NotificationSchema = new mongoose.Schema({
    user_id: {
        type: mongoose.Types.ObjectId,
        ref: "User",
    },
    message: {
        type: String,
        required: true
    },
    content: {
        type: mongoose.Schema.ObjectId,
        refPath: 'content_type'
    },
    content_type: {
        type: String,
        enum: [NotificationContentType.report, NotificationContentType.review]
    },
    isRead: {
        type: Boolean,
        default: false
    },
    created_at: {
        type: Date,
    }
});

NotificationSchema.index({ user_id: 1, isRead: -1, created_at: -1 })
export const NotificationModel = mongoose.model<INotification>("Notification", NotificationSchema);
