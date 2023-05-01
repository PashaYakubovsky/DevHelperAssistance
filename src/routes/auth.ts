import express from "express";
import { Request, Response } from "express";
import db from "../db/config";
import jwt from "jsonwebtoken";

const router = express.Router();

router.post("/auth/login", async (req: Request, res: Response) => {
    try {
        const body = req.body;

        if (body.password && body.name) {
            const querySnapshot = await db
                .collection("Users")
                .where("name", "==", body.name)
                .where("password", "==", body.password)
                .get();

            if (querySnapshot.empty) {
                return res.status(400).send("No matching documents");
            } else {
                const user = querySnapshot.docs[0].data();
                console.log(user);
                console.log(process.env.TOKEN_KEY);
                const token = jwt.sign(user, process.env.TOKEN_KEY, {
                    expiresIn: "24h",
                });

                return res.send(token);
            }
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});

export default router;
