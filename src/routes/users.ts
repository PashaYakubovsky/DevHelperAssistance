import db from "../db/config";
import { FastifyInstance } from "fastify";
import verifyToken from "../middleware/auth";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

// const router = express.Router();

const userSchema = {
    type: "object",
    properties: {
        userId: { type: "string" },
        name: { type: "string" },
        password: { type: "string" },
        avatarUrl: { type: "string" },
    },
    required: ["userId", "name", "password"],
};

interface IUserProps {
    userId: string;
    name: string;
    password: string;
    avatarUrl?: string;
}

async function routes(fastify: FastifyInstance, options: object) {
    fastify.get("/api/v1/user/:id", { preHandler: verifyToken }, async (req, res) => {
        try {
            const id = (req.params as { id: string })?.id;
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
    // authMiddleware
    fastify.post<{ Body: IUserProps }>(
        "/api/v1/user/create",
        { schema: { body: userSchema }, preHandler: verifyToken },
        async (req, res) => {
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
        }
    );

    fastify.put<{ Body: IUserProps }>(
        "/api/v1/user/update",
        { schema: { body: userSchema }, preHandler: verifyToken },
        async (req, res) => {
            try {
                const body = req.body;
                if (body.userId) {
                    const user = await db
                        .collection("Users")
                        .where("userId", "==", body.userId)
                        .get();
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
        }
    );

    fastify.delete<{ Params: { id: string } }>(
        "/api/v1/user/delete/:id",
        { preHandler: verifyToken },
        async (req, res) => {
            try {
                const id = req.params.id;
                if (id) {
                    const docId = (await db.collection("Users").where("userId", "==", id).get())
                        .docs[0].id;

                    await db.collection("Users").doc(docId).delete();

                    return res.send(204);
                }
            } catch (err) {
                console.log(err);
                return res.status(400).send(err.message);
            }
        }
    );
}

export default routes;
