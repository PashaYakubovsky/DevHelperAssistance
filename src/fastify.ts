import loggerRouter from "./routes/logger";
import usersRouter from "./routes/users";
import chatRouter from "./routes/chat";
// import helmet from "@fastify/helmet";
import authRouter from "./routes/auth";
import portfolioRouter from "./routes/portfolio";
import fastify, { FastifyInstance } from "fastify";
import cors from "@fastify/cors";
import https from "https";
import http from "http";
import fs from "node:fs";
import path from "node:path";
import { port, wsPort } from "./config.json";
import "firebase/storage";
import fastifyIO from "fastify-socket.io";
import db from "./db/config";
import { v4 as uuid } from "uuid";

require("dotenv").config();
import { plugin as socketPlugin } from "./plugins/socket-plugin";

const serverFactoryHttps = (handler, opts) => {
    const sslKeyPath = path.resolve(__dirname, "sslKey.pem");
    const sslCertPath = path.resolve(__dirname, "sslCert.pem");

    const options = {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
    };

    const httpsServer = https.createServer(options, (req, res) => {
        handler(req, res);
    });

    return httpsServer;
};

const serverFactoryHttp = (handler, opts) => {
    const httpServer = http.createServer((req, res) => {
        handler(req, res);
    });

    return httpServer;
};

const serverHttps = fastify({ logger: true, serverFactory: serverFactoryHttps });
const serverHttp = fastify({ logger: true, serverFactory: serverFactoryHttp });

// Run the server!
const start = async (server: FastifyInstance, port: number) => {
    try {
        // await server.register(
        //     helmet,
        //     // Example disables the `contentSecurityPolicy` middleware but keeps the rest.
        //     { contentSecurityPolicy: false }
        // );

        await server.register(cors, {
            origin: "*",
        });

        // settings the routes for api
        await server.register(loggerRouter);
        await server.register(usersRouter);
        await server.register(chatRouter);
        await server.register(authRouter);
        await server.register(portfolioRouter);
        // await server.register(fastifyIO);
        await server.ready();
        await server.register(socketPlugin);

        // .then(() => {
        // we need to wait for the server to be ready, else `server.io` is undefined
        // server.io.on("connection", socket => {
        //     console.log("User connected: " + socket.id);
        //     socket.on("disconnect", async () => {
        //         console.log("user disconnected");
        //     });
        //     socket.on("closed", async () => {
        //         console.log("socket closed");
        //     });
        //     socket.on("message", async args => {
        //         const message = args?.message;
        //         if (message) {
        //             socket.emit("message", message);
        //             await db.collection("Messages").add(message);
        //         }
        //     });
        //     socket.on(
        //         "image",
        //         (args: { name?: string; type?: string; data?: File; user?: any }) => {
        //             const imageData = args;
        //             socket.emit("image", imageData);
        //             const newMessage = {
        //                 dateCreate: new Date().toISOString(),
        //                 messageId: uuid(),
        //                 message: "image",
        //                 status: 2,
        //                 user: imageData?.user,
        //                 isFromBlob: true,
        //             };
        //             db.collection("Messages").add(newMessage);
        //         }
        //     );
        //     socket.on(
        //         "typing",
        //         (args: { typing: boolean; user: { userId: string; name: string } }) => {
        //             console.log(args);
        //             socket.emit("typing", args);
        //         }
        //     );
        // });
        // });

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
        // await server.register(fastifyIO);

        // server.register(require("fastify-static"), {
        //     root: path.join(__dirname, "public"),
        // });

        // await server.ready().then(() => {
        //     socketRoutes(server as FastifyInstance, {
        //         cors: { origin: "*" },
        //     });
        // });

        server.listen({ port }, (err, address) => {
            if (err) {
                console.error(err);
                process.exit(1);
            }
            console.log(`Server listening at: ${address}`);
        });

        // server.register(require("fastify-socket.io"), {
        //     // put your options here
        //     logLevel: "debug",
        // });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

Promise.all([start(serverHttp, wsPort), start(serverHttps, port)])
    .then(() => {
        console.log("All servers listening: [  ]");
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });