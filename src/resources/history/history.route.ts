import { Router } from "express";
import { getHistories } from "./history.controller";

const historyRouter = Router();
historyRouter.get("", getHistories);

export default historyRouter;
