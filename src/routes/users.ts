import express from "express";
import { Request, Response } from "express";
import db from "../db/config";
import authMiddleware from "../middleware/auth";

const router = express.Router();

router.get("/user/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        const querySnapshot = await db.collection("Users").where("userId", "==", id).get();
        if (querySnapshot.empty) {
            return res.status(400).send("No matching documents");
        } else {
            const user = querySnapshot.docs[0].data();
            return res.send(user);
        }
    } catch (err) {
        console.log(err);
    }

    return res.send(400);
});

router.post("/user/create", async (req: Request, res: Response) => {
    try {
        const body = req.body;
        if (body.userId && body.name && body.password) {
            const newUser = {
                ...body,
                createDate: new Date().toISOString(),
                avatarUrl: body?.avatarUrl ?? "",
            };

            const querySnapshot = await db
                .collection("Users")
                .where("userId", "==", body.userId)
                .get();

            if (querySnapshot.empty) {
                await db.collection("Users").add(newUser);
                return res.send(body);
            } else {
                return res.status(409).send("User already created");
            }
        }
    } catch (err) {
        console.log(err);
    }

    return res.send(400);
});

router.put("/user/update", async (req: Request, res: Response) => {
    try {
        const body = req.body;
        if (body.userId) {
            const user = await db.collection("Users").where("userId", "==", body.userId).get();
            const doc = user.docs[0];
            const id = doc.id;

            const newUser = {
                ...user.docs[0].data(),
                ...body,
                updatedDate: new Date().toISOString(),
            };

            await db.collection("Users").doc(id).set(newUser);

            return res.status(201).send(body);
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});

router.delete("/user/delete/:id", async (req: Request, res: Response) => {
    try {
        const id = req.params.id;
        if (id) {
            const docId = (await db.collection("Users").where("userId", "==", id).get()).docs[0].id;

            await db.collection("Users").doc(docId).delete();

            return res.send(204);
        }
    } catch (err) {
        console.log(err);
        return res.status(400).send(err.message);
    }
});

export default router;
