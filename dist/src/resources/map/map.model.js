"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Map = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const MapSchema = new mongoose_1.default.Schema({
    period: {
        type: Number,
        required: true,
    },
    geoJson: {
        type: JSON,
        required: true,
    },
});
exports.Map = mongoose_1.default.model("Map", MapSchema);
//# sourceMappingURL=map.model.js.map