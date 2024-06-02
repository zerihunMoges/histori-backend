import mongoose from "mongoose";
import { ReportStatus, ReportType } from "../../types/report";

export interface IReport {
  id: mongoose.Types.ObjectId;
  title: string;
  reporter_id: mongoose.Types.ObjectId;
  content_id: mongoose.Types.ObjectId;
  type: string;
  reason: string;
  status: string;
}

const ReportSchema = new mongoose.Schema({
  reporter_id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
    required: true,
    maxlength: [200, "Title can not exceed 200 characters"],
    minlength: [1, "Title can not be less than one character"],
  },
  content_id: {
    type: mongoose.Schema.ObjectId,
    refPath: 'type'
  },
  type: {
    type: String,
    enum: [ReportType.history, ReportType.map]
  },
  reason: {
    type: String,
    required: [true, "Reason for report is required"],
    maxlength: [500, "Reason can not exceed 500 characters"],
    minlength: [1, "Reason can not be less than one character"],
  },
  status: {
    type: String,
    enum: [ReportStatus.open, ReportStatus.underReview, ReportStatus.closed],
    default: ReportStatus.open,
  },
}, { timestamps: true });

export const Report = mongoose.model<IReport>("Report", ReportSchema);
export { ReportType };

