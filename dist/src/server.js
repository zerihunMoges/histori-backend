"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.start = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const db_1 = __importDefault(require("../db"));
const config_1 = require("../config");
const map_route_1 = __importDefault(require("./resources/map/map.route"));
const compression_1 = __importDefault(require("compression"));
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use((0, compression_1.default)());
app.use((0, cors_1.default)({ origin: true }));
app.use("/api/map", map_route_1.default);
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        app.listen(config_1.config.port, "0.0.0.0", () => {
            console.log(`REST API on http://localhost:${config_1.config.port}/api`);
        });
    }
    catch (err) {
        console.error(err);
    }
});
exports.start = start;
//# sourceMappingURL=server.js.map