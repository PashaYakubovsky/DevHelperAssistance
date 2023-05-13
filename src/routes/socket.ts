import fs from "node:fs";
import https from "https";
import { v4 as uuid } from "uuid";
import db from "../db/config";
import fastify from "fastify";
import fastifyIO from "fastify-socket.io";
import path from "node:path";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

const serverFactory = (handler, opts) => {
    const sslKeyPath = path.resolve(__dirname, "..", "sslKey.pem");
    const sslCertPath = path.resolve(__dirname, "..", "sslCert.pem");
    const options = {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
    };

    const httpsServer = https.createServer(options, (req, res) => {
        handler(req, res);
    });

    return httpsServer;
};

const server = fastify({ serverFactory, logger: true });

server.register(fastifyIO);

server.ready().then(() => {
    // we need to wait for the server to be ready, else `server.io` is undefined
    server.io.on("connection", socket => {
        console.log("User connected: " + socket.id);
        socket.on("disconnect", async () => {
            console.log("user disconnected");
        });
        socket.on("closed", async () => {
            console.log("socket closed");
        });
        socket.on("message", async args => {
            const message = args?.message;
            if (message) {
                socket.emit("message", message);

                await db.collection("Messages").add(message);
            }
        });
        socket.on("image", (args: { name?: string; type?: string; data?: File; user?: any }) => {
            const imageData = args;

            socket.emit("image", imageData);

            const newMessage = {
                dateCreate: new Date().toISOString(),
                messageId: uuid(),
                message: "image",
                status: 2,
                user: imageData?.user,
                isFromBlob: true,
            };

            db.collection("Messages").add(newMessage);
        });
        socket.on("typing", (args: { typing: boolean; user: { userId: string; name: string } }) => {
            console.log(args);
            socket.emit("typing", args);
        });
    });
});

// // we need to wait for the server to be ready, else `fastify.io` is undefined
// async function socketRoutes(fastify: FastifyInstance, opts: Object, done: Function) {
//     await fastify.ready();

//     // register Socket.io with Fastify
//     fastify.decorate("io", fastifyIO);
//     fastify.register((fastify, opts, next) => {
//         next();
//     });

//     done();
// }

server.listen({ port: 3000 });

// export default socketRoutes;
