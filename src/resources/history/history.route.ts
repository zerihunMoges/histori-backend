import { Router } from "express";
import { createHistories, getHistories } from "./history.controller";

const historyRouter = Router();

historyRouter
    .route("/")
    .get(getHistories)
    .post(createHistories);

export default historyRouter;
