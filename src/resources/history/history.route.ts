import { Router } from "express";
import { getHistories, createHistories } from "./history.controller";

const historyRouter = Router();
historyRouter.get("", getHistories);
historyRouter.post("", createHistories);

export default historyRouter;
