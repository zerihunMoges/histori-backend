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
exports.getMap = void 0;
const map_model_1 = require("./map.model");
const memory_cache_1 = __importDefault(require("memory-cache"));
function getMap(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        let { period } = req.query;
        try {
            if (typeof period !== "string") {
                return res.status(400).json({ message: "invalid period parameter" });
            }
            let targetYear;
            const year = parseInt(period);
            if (isNaN(year)) {
                return res.status(400).json({ message: "Invalid period parameter" });
            }
            const cachedPeriod = memory_cache_1.default.get(`period ${year}`);
            if (cachedPeriod) {
                targetYear = cachedPeriod;
            }
            else {
                const periods = yield map_model_1.Map.find()
                    .select("period")
                    .then((periods) => periods.map((period) => period.period));
                periods.sort((a, b) => a - b);
                const targetPeriod = findClosestPeriod(year, periods);
                targetYear = targetPeriod;
                memory_cache_1.default.put(`period ${year}`, targetYear, 10000);
            }
            const cachedData = memory_cache_1.default.get(`map ${targetYear}`);
            if (cachedData) {
                return res.status(200).json(cachedData);
            }
            const mapData = yield map_model_1.Map.findOne({ period: targetYear });
            memory_cache_1.default.put(`map ${targetYear}`, mapData, 10000);
            return res.status(200).json(mapData);
        }
        catch (err) {
            console.error(err);
            return res.status(500).json({ message: "Internal server error" });
        }
    });
}
exports.getMap = getMap;
function findClosestPeriod(target, periods) {
    // Binary search for the closest period
    let left = 0;
    let right = periods.length - 1;
    let closestPeriod = null;
    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (periods[mid] === target) {
            closestPeriod = periods[mid];
            break;
        }
        else if (periods[mid] < target) {
            if (closestPeriod === null ||
                Math.abs(closestPeriod - target) > Math.abs(periods[mid] - target))
                closestPeriod = periods[mid];
            left = mid + 1;
        }
        else {
            if (closestPeriod === null ||
                Math.abs(closestPeriod - target) > Math.abs(periods[mid] - target))
                closestPeriod = periods[mid];
            right = mid - 1;
        }
    }
    return closestPeriod;
}
//# sourceMappingURL=map.controller.js.map