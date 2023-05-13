"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const logger_1 = __importDefault(require("./routes/logger"));
const users_1 = __importDefault(require("./routes/users"));
const chat_1 = __importDefault(require("./routes/chat"));
// Require the framework and instantiate it
const helmet_1 = __importDefault(require("@fastify/helmet"));
const auth_1 = __importDefault(require("./routes/auth"));
const portfolio_1 = __importDefault(require("./routes/portfolio"));
const fastify_1 = __importDefault(require("fastify"));
const cors_1 = __importDefault(require("@fastify/cors"));
const https_1 = __importDefault(require("https"));
const http_1 = __importDefault(require("http"));
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const config_json_1 = require("./config.json");
// import axios from "axios";
// import firebase from "firebase/app";
require("firebase/storage");
const socket_1 = __importDefault(require("./routes/socket"));
require("dotenv").config();
let httpServer;
let httpsServer;
const serverFactory = (handler, opts) => {
    httpServer = http_1.default.createServer((req, res) => {
        handler(req, res);
    });
    const options = {
        port: config_json_1.port,
        key: node_fs_1.default.readFileSync(node_path_1.default.resolve(__dirname, "sslKey.pem")),
        cert: node_fs_1.default.readFileSync(node_path_1.default.resolve(__dirname, "sslCert.pem")),
        agent: false,
    };
    httpsServer = https_1.default.createServer(options, (req, res) => {
        handler(req, res);
    });
    return httpsServer;
};
const server = (0, fastify_1.default)({ logger: true, serverFactory });
// Run the server!
const start = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield server.register(helmet_1.default, 
        // Example disables the `contentSecurityPolicy` middleware but keeps the rest.
        { contentSecurityPolicy: false });
        yield server.register(cors_1.default, {
            origin: "*",
        });
        // settings the routes for api
        server.register(logger_1.default);
        server.register(users_1.default);
        server.register(chat_1.default);
        server.register(auth_1.default);
        server.register(portfolio_1.default);
        // server.register(require("fastify-static"), {
        //     root: path.join(__dirname, "public"),
        // });
        (0, socket_1.default)(server, {
            cors: { origin: "*" },
        });
        server.ready(err => {
            if (err) {
                server.log.error(err);
            }
            server.listen({ port: config_json_1.port });
            server.log.info(`Server listening ${config_json_1.port}!`);
        });
        // server.register(require("fastify-socket.io"), {
        //     // put your options here
        //     logLevel: "debug",
        // });
        // Web socket
        try {
            server.listen({ port: 3000 });
            server.log.info(`Server listening 3000 WebSocket!`);
        }
        catch (err) {
            console.log(err);
        }
    }
    catch (err) {
        server.log.error(err);
        process.exit(1);
    }
});
start();
