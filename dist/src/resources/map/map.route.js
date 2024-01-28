"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const map_controller_1 = require("./map.controller");
const mapRouter = (0, express_1.Router)();
mapRouter.get("", map_controller_1.getMap);
exports.default = mapRouter;
//# sourceMappingURL=map.route.js.map