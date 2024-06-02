import mongoose from "mongoose";

export interface IHistory {
  id: mongoose.Types.ObjectId;
  title: string;
  country: string;
  start_year: number;
  end_year: number;
  content: string;
  categories: string[];
  sources: string[];
}

const HistorySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  country: {
    type: String,
    required: true,
  },
  start_year: {
    type: Number,
    required: true,
  },
  end_year: {
    type: Number,
  },
  content: {
    type: String,
    required: true,
  },
  categories: {
    type: Array<String>,
    required: true,
  },
  sources: {
    type: Array<String>,
  },
});

const TempHistorySchema = new mongoose.Schema({
  _id: {
    type: mongoose.Types.ObjectId,
    ref: "User",
  },
  title: {
    type: String,
  },
  country: {
    type: String,
  },
  start_year: {
    type: Number,
  },
  end_year: {
    type: Number,
  },
  content: {
    type: String,
  },
  categories: {
    type: Array<String>,
  },
  sources: {
    type: Array<String>,
  },
}, { _id: false });

export const History = mongoose.model<IHistory>("History", HistorySchema);
export const TempHistory = mongoose.model<IHistory>("TempHistory", TempHistorySchema);
