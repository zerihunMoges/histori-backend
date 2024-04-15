import { ca } from "date-fns/locale";
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
    required: true,
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

export const History = mongoose.model<IHistory>("History", HistorySchema);
