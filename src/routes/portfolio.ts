import express from "express";
import { Request, Response } from "express";
import db from "../db/config";
import authMiddleware from "../middleware/auth";
import { io } from "..";

const router = express.Router();

router.post("/change-3d-text", authMiddleware, async (req: Request, res: Response) => {
    const { message } = req.body;

    io?.emit("changeText", message ?? "test");

    res.status(200).send("Message received");
});

// Get the count of active sockets
function getActiveSocketCount() {
    return Object.keys(io.sockets.sockets).length;
}

// Example usage
router.get("/active-socket-count", (req, res) => {
    const count = getActiveSocketCount();
    res.json({ count });
});

router.get("/get-3d-text", async (req: Request, res: Response) => {
    const message = db.collection("config").doc("message");

    res.status(200).send({ message: message ?? "" });
});

export default router;
