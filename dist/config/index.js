"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
require("dotenv").config();
exports.config = {
    port: process.env.PORT || 8000,
    dataBase: process.env.DATABASE_URI || "",
};
//# sourceMappingURL=index.js.map