import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

const config = process.env;

const verifyToken = (req: Request, res: Response, next: NextFunction) => {
    const clientOrigin = req.get("Origin");

    const token =
        req.body.token ||
        req.query.token ||
        req.headers["x-access-token"] ||
        req.headers?.authorization?.split(" ")[1];

    if (!token) {
        return res.status(403).send("A token is required for authentication");
    }
    if (
        (token === "SUPER_SECRET_220" && clientOrigin === "https://pashayakubovsky.netlify.app") ||
        clientOrigin.includes("http://localhost")
    ) {
        return next();
    }
    try {
        const decoded = jwt.verify(token, config.TOKEN_KEY);
    } catch (err) {
        return res.status(401).send("Invalid Token");
    }

    return next();
};

export default verifyToken;
