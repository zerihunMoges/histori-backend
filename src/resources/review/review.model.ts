import mongoose from "mongoose";
import { ConflictError } from "../../core/ApiError";
import { ReportType } from "../report/report.model";

export enum ReviewType {
    Map = "Map",
    History = "TempHistory",
}

export enum ReviewStatus {
    Pending = "Pending",
    Approved = "Approved",
}

export interface IReview {
    _id: mongoose.Types.ObjectId;
    reviewer: mongoose.Types.ObjectId;
    report: mongoose.Types.ObjectId;
    content_id: mongoose.Types.ObjectId;
    type: string;
    changes: string;
    status: string;
    due_date: Date;
}

const ReviewSchema = new mongoose.Schema({
    reviewer: {
        type: mongoose.Types.ObjectId,
        ref: "User"
    },
    report: {
        type: mongoose.Types.ObjectId,
        ref: "Report",
    },
    content_id: {
        type: mongoose.Schema.ObjectId,
        refPath: 'type'
    },
    type: {
        type: String,
        enum: [ReportType.History, ReportType.Map]
    },
    changes: {
        type: String,
        maxlength: [500, "Changes can not exceed 500 characters"],
    },
    due_date: {
        type: Date,
        required: true,
    },
    status: {
        type: String,
        enum: [ReviewStatus.Pending, ReviewStatus.Approved],
        default: ReviewStatus.Pending,
    },
});


const addedDays = (7 * 24 * 60 * 60 * 1000); // 7 days in milliseconds
const nearestHour = 6; // Round to nearest 6-hour mark

export function calculateDueDate() {
    const currentDate = new Date();
    const dueDate = new Date(currentDate.getTime() + addedDays);
    dueDate.setHours(Math.ceil(dueDate.getHours() / nearestHour) * nearestHour);
    return dueDate;
}

ReviewSchema.pre("save", function (next) {
    Review.findOne({ reviewer: this.reviewer, status: ReviewStatus.Pending })
        .then(existingReview => {
            if (existingReview) {
                throw new ConflictError('This user already has an active Review.');
            } else {
                next();
            }
        })
        .catch(err => next(err));
});

export const Review = mongoose.model<IReview>("Review", ReviewSchema);
