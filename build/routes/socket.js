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
const fastify_socket_io_1 = __importDefault(require("fastify-socket.io"));
const uuid_1 = require("uuid");
const config_1 = __importDefault(require("../db/config"));
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
function socketRoutes(fastify, opts) {
    fastify.register(fastify_socket_io_1.default, opts);
    fastify.ready().then(() => {
        // we need to wait for the server to be ready, else `fastify.io` is undefined
        fastify.io.on("connection", socket => {
            console.log("User connected: " + socket.id);
            socket.on("disconnect", () => __awaiter(this, void 0, void 0, function* () {
                console.log("user disconnected");
            }));
            socket.on("closed", () => __awaiter(this, void 0, void 0, function* () {
                console.log("socket closed");
            }));
            socket.on("message", (args) => __awaiter(this, void 0, void 0, function* () {
                const message = args === null || args === void 0 ? void 0 : args.message;
                if (message) {
                    socket.emit("message", message);
                    yield config_1.default.collection("Messages").add(message);
                }
            }));
            socket.on("image", args => {
                const imageData = args;
                socket.emit("image", imageData);
                const newMessage = {
                    dateCreate: new Date().toISOString(),
                    messageId: (0, uuid_1.v4)(),
                    message: "image",
                    status: 2,
                    user: imageData === null || imageData === void 0 ? void 0 : imageData.user,
                    isFromBlob: true,
                };
                config_1.default.collection("Messages").add(newMessage);
            });
            socket.on("typing", (args) => {
                console.log(args);
                socket.emit("typing", args);
            });
        });
    });
    return fastify;
}
exports.default = socketRoutes;
