import express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import historyRouter from "./resources/history/history.route";
import connectDB from "../db";
import { config } from "../config";
import mapRouter from "./resources/map/map.route";
import compression from "compression";

const app = express();
app.use(express.json());
app.use(compression());
app.use(cors({ origin: true }));

app.use("/api/map", mapRouter);

export const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, "0.0.0.0", () => {
      console.log(`REST API on http://localhost:${config.port}/api`);
    });
  } catch (err) {
    console.error(err);
  }
};
