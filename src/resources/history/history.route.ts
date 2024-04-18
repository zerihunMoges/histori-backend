import { Router } from "express";
import { getHistories, createHistories } from "./history.controller";
import { authenticate, permit} from "../../middlewares/authentication";
import { Role } from "../../utils/roles";

const historyRouter = Router();

historyRouter
.route("/")
.get(getHistories)
.post(authenticate, permit(Role.Admin, Role.Contributor), createHistories);

export default historyRouter;
