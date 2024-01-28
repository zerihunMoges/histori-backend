import mongoose from "mongoose";

export interface IMap {
  id: mongoose.Types.ObjectId;
  period: number;
  geoJson: JSON;
}

const MapSchema = new mongoose.Schema({
  period: {
    type: Number,
    required: true,
  },
  geoJson: {
    type: JSON,
    required: true,
  },
});

export const Map = mongoose.model<IMap>("Map", MapSchema);
