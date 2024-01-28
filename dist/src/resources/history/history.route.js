"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const history_controller_1 = require("./history.controller");
const historyRouter = (0, express_1.Router)();
historyRouter.get("", history_controller_1.getHistories);
exports.default = historyRouter;
//# sourceMappingURL=history.route.js.map