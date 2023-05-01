import express from "express";
import { Request, Response } from "express";
import db from "../db/config";
import jwt from "jsonwebtoken";
import authMiddleware from "../middleware/auth";
import firebase from "firebase-admin";
import { v4 as uuid } from "uuid";

const router = express.Router();

router.get(
    "/chat/messages",
    authMiddleware,
    async (req: Request<null, null, null, { limit: string; startAt: string }>, res: Response) => {
        try {
            const limit = req.query?.limit ? Number.parseInt(req.query.limit) : null;
            // const startAt = Number.parseInt(req.query?.startAt ?? '0')
            const startAt = req.query?.startAt ? Number.parseInt(req.query.startAt) : null;

            const querySnapshot = await db
                .collection("Messages")
                .orderBy("dateCreate", "desc")
                .limit(100000)
                .get();

            // if (Number.isInteger(limit) && Number.isInteger(startAt)) {
            //     querySnapshot = await db
            //         .collection("Messages")
            //         .orderBy("dateCreate", "desc")
            //         .limit(100000)
            //         .get();
            // } else {
            //     querySnapshot = await db.collection("Messages").get();
            // }

            if (querySnapshot.empty) {
                return res.status(400).send("No matching documents");
            } else {
                const messages = querySnapshot.docs.map(doc => {
                    const data = doc.data();
                    data.user.password = null;
                    data.id = doc.id;
                    return data;
                });

                return res.send(messages);
            }
        } catch (err) {
            console.log(err);
            res.status(500).send("Something went wrong");
        }
    }
);

export default router;
