import compression from "compression";
import cors from "cors";
import express from "express";
import { config } from "../config";
import connectDB from "../db";
import claimRouter from "./resources/claim/claim.route";
import historyRouter from "./resources/history/history.route";
import mapRouter from "./resources/map/map.route";
import reportRouter from "./resources/report/report.route";
import userRouter from "./resources/user/user.route";
import scriptRouter from "./scripts/auto_populate";


const app = express();
app.use(express.json());
app.use(compression());
app.use(cors({ origin: true }));

app.use(`/api/v${config.apiVersion}/map`, mapRouter);
app.use(`/api/v${config.apiVersion}/script`, scriptRouter);
app.use(`/api/v${config.apiVersion}/users`, userRouter);
app.use(`/api/v${config.apiVersion}/histories`, historyRouter);
app.use(`/api/v${config.apiVersion}/reports`, reportRouter);
app.use(`/api/v${config.apiVersion}/claims`, claimRouter);

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
