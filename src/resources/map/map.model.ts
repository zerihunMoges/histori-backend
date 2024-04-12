import mongoose, { Schema, Document, Types } from "mongoose";

// Define Properties Schema
interface IProperties extends Document {
  NAME: string;
  ABBREVN?: string;
  SUBJECTO?: string;
  BORDERPRECISION?: number;
  PARTOF?: string;
}

const PropertiesSchema: Schema = new Schema({
  NAME: {
    type: String,
    required: true,
    // unique: true, // Ensure uniqueness of NAME
  },
  ABBREVN: {
    type: String,
  },
  SUBJECTO: {
    type: String,
  },
  BORDERPRECISION: {
    type: Number,
  },
  PARTOF: {
    type: String,
  },
});

const Properties = mongoose.model<IProperties>("Properties", PropertiesSchema);

// Define Geometry Schema
interface IGeometry extends Document {
  type: string;
  coordinates: any; // Allow flexible data type for coordinates
}

const GeometrySchema: Schema = new Schema({
  type: {
    type: String,
    required: true,
  },
  coordinates: {
    type: Schema.Types.Mixed,
    required: true,
  },
});

const Geometry = mongoose.model<IGeometry>("Geometry", GeometrySchema);

// Define Map Schema
interface IMap extends Document {
  startPeriod: number;
  endPeriod: number;
  properties: Types.ObjectId;
  geometry: Types.ObjectId;
}

const MapSchema: Schema = new Schema({
  startPeriod: {
    type: Number,
    required: true,
  },
  endPeriod: {
    type: Number,
    required: true,
  },
  properties: {
    type: Schema.Types.ObjectId,
    ref: "Properties",
    required: true,
  },
  geometry: {
    type: Schema.Types.ObjectId,
    ref: "Geometry",
    required: true,
  },
});

const Map = mongoose.model<IMap>("Map", MapSchema);

export { Map, Properties, Geometry };
