import express from "express";
import bodyparser from "body-parser";
import cors from "cors";
import historyRouter from "./resources/history/history.route";
import connectDB from "../db";
import { config } from "../config";
import mapRouter from "./resources/map/map.route";
import compression from "compression";
import scriptRouter from "./scripts/auto_populate";
import userRouter from "./resources/user/user.route";


const app = express();
app.use(express.json());
app.use(compression());
app.use(cors({ origin: true }));

app.use(`/api/v${config.apiVersion}/map`, mapRouter);
app.use(`/api/v${config.apiVersion}/script`, scriptRouter);
app.use(`/api/v${config.apiVersion}/users`, userRouter);
app.use(`/api/v${config.apiVersion}/histories`, historyRouter);

export const start = async () => {
  try {
    await connectDB();
    app.listen(config.port, "0.0.0.0", () => {
      console.log(`REST API on http://localhost:${config.port}/api/v${config.apiVersion}`);
    });
  } catch (err) {
    console.error(err);
  }
};
