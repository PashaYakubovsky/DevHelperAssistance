import loggerRouter from "./routes/logger";
import usersRouter from "./routes/users";
import chatRouter from "./routes/chat";
import helmet from "@fastify/helmet";
import authRouter from "./routes/auth";
import portfolioRouter from "./routes/portfolio";
import fastify from "fastify";
import cors from "@fastify/cors";
import https from "https";
import http from "http";
import fs from "node:fs";
import path from "node:path";
import { port } from "./config.json";
import "firebase/storage";
// import { Http2SecureServer } from "http2";
import "./routes/socket";
// import fastifyIO from "fastify-socket.io";

require("dotenv").config();

let httpServer;
let httpsServer;
let httpsServer2;

const serverFactory = (handler, opts) => {
    const sslKeyPath = path.resolve(__dirname, "sslKey.pem");
    const sslCertPath = path.resolve(__dirname, "sslCert.pem");

    httpServer = http.createServer((req, res) => {
        handler(req, res);
    });

    const options = {
        key: fs.readFileSync(sslKeyPath),
        cert: fs.readFileSync(sslCertPath),
    };

    httpsServer = https.createServer(options, (req, res) => {
        handler(req, res);
    });
    httpsServer2 = https.createServer(options, (req, res) => {
        handler(req, res);
    });

    return httpsServer;
};

const server = fastify({ logger: true, serverFactory });

// Run the server!
const start = async () => {
    try {
        await server.register(
            helmet,
            // Example disables the `contentSecurityPolicy` middleware but keeps the rest.
            { contentSecurityPolicy: false }
        );

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

        // server.register(require("fastify-static"), {
        //     root: path.join(__dirname, "public"),
        // });

        // await server.ready().then(() => {
        //     socketRoutes(server as FastifyInstance, {
        //         cors: { origin: "*" },
        //     });
        // });

        await server.listen({ port });

        // server.register(require("fastify-socket.io"), {
        //     // put your options here
        //     logLevel: "debug",
        // });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();
