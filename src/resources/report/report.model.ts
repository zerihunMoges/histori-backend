import mongoose from "mongoose";

export interface IReport {
  id: mongoose.Types.ObjectId;
  history_id: mongoose.Types.ObjectId;
  review_id: mongoose.Types.ObjectId;
  reason: string;
}

const ReportSchema = new mongoose.Schema({
  history: {
    type: mongoose.Schema.ObjectId,
    ref: "History",
  },
  review: {
    type: mongoose.Schema.ObjectId,
    ref: "Review",
    required: false,
  },
  reason: {
    type: String,
    required: [true, "Reason for report is required"],
    maxlength: [500, "Reason can not exceed 500 characters"],
    minlength: [1, "Reason can not be less than one character"],
  }
});

export const Report = mongoose.model<IReport>("Report", ReportSchema);
