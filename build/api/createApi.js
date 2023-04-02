"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
const httpAgent = new https_1.default.Agent({
    rejectUnauthorized: false,
});
module.exports = {
    api: axios_1.default.create({ httpAgent }),
};
