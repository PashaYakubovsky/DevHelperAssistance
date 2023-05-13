"use strict";
// import jwt from "jsonwebtoken";
// import { Request, Response, NextFunction } from "express";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// const config = process.env;
// const verifyToken = (req: Request, res: Response, next: NextFunction) => {
//     const clientOrigin = req.get("Origin");
//     const token =
//         req.body.token ||
//         req.query.token ||
//         req.headers["x-access-token"] ||
//         req.headers?.authorization?.split(" ")[1];
//     if (!token) {
//         return res.status(403).send("A token is required for authentication");
//     }
//     if (
//         (token === "SUPER_SECRET_220" && clientOrigin === "https://pashayakubovsky.netlify.app") ||
//         clientOrigin.includes("http://localhost")
//     ) {
//         return next();
//     }
//     try {
//         const decoded = jwt.verify(token, config.TOKEN_KEY);
//     } catch (err) {
//         return res.status(401).send("Invalid Token");
//     }
//     return next();
// };
// export default verifyToken;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config = process.env;
const verifyToken = (req, res, next) => {
    var _a, _b;
    const clientOrigin = req.headers.origin;
    const body = req.body;
    const query = req.query;
    const token = body.token ||
        query.token ||
        req.headers["x-access-token"] ||
        ((_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1]);
    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    debugger;
    if ((token === "SUPER_SECRET_220" && clientOrigin === "https://pashayakubovsky.netlify.app") ||
        (clientOrigin === null || clientOrigin === void 0 ? void 0 : clientOrigin.includes("http://localhost"))) {
        return next();
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config.TOKEN_KEY);
    }
    catch (err) {
        return res.status(401).send("Invalid Token");
    }
    return next();
};
exports.default = verifyToken;
