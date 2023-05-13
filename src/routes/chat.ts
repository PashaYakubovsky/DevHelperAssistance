import db from "../db/config";
import { FastifyInstance } from "fastify";
import verifyToken from "../middleware/auth";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

interface IMessage {
    limit: string;
    startAt: string;
}
async function routes(fastify: FastifyInstance, object: Object) {
    fastify.get<{ Querystring: IMessage }>("/api/v1/chat/messages", async (req, res) => {
        try {
            // const limit = req.query?.limit ? Number.parseInt(req.query.limit) : null;
            // // const startAt = Number.parseInt(req.query?.startAt ?? '0')
            // const startAt = req.query?.startAt ? Number.parseInt(req.query.startAt) : null;

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
    });
}

export default routes;
