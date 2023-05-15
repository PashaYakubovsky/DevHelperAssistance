import { FastifyInstance } from "fastify";
// import db from "../db/config";
// import fastify from "fastify";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

interface IMessage {
    message: string;
}

async function routes(fastify: FastifyInstance, options: object) {
    // const server = fastify();
    fastify.post<{ Body: IMessage }>("/change-3d-text", async (req, res) => {
        const { message } = req.body;
        const io = req.server.io;

        io.emit("changeText", message ?? "test");

        res.status(200).send("Message received");
    });
}

export default routes;
