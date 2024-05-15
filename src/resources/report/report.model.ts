import mongoose from "mongoose";

export enum ReportType {
  Map = "Map",
  History = "History",
}

export enum ReportStatus {
  Open = "open",
  UnderReview = "under_review",
  Closed = "closed",
}

export interface IReport {
  id: mongoose.Types.ObjectId;
  reporter_id: mongoose.Types.ObjectId;
  content_id: mongoose.Types.ObjectId;
  type: string;
  review_id: mongoose.Types.ObjectId;
  reason: string;
  status: string;
}

const ReportSchema = new mongoose.Schema({
  reporter_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  content_id: {
    type: mongoose.Schema.ObjectId,
    refPath: 'type'
  },
  type: {
    type: String,
    enum: [ReportType.History, ReportType.Map]
  },
  review: {
    type: mongoose.Schema.ObjectId,
    ref: "Review",
  },
  reason: {
    type: String,
    required: [true, "Reason for report is required"],
    maxlength: [500, "Reason can not exceed 500 characters"],
    minlength: [1, "Reason can not be less than one character"],
  },
  status: {
    type: String,
    enum: [ReportStatus.Open, ReportStatus.UnderReview, ReportStatus.Closed],
    default: ReportStatus.Open,
  },
}, { timestamps: true });

export const Report = mongoose.model<IReport>("Report", ReportSchema);
