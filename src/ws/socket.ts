import { RawServerDefault } from "fastify";
import db from "../db/config";
import { v4 as uuid } from "uuid";
import { Server } from "socket.io";

// socket.js
const socketIO = require("socket.io");

async function initSocket(server: RawServerDefault) {
    // const io = socketIO(server);
    const io = new Server();

    io.on("connection", socket => {
        console.log(`Client connected: ${socket.id}`);

        socket.on("disconnect", () => {
            console.log(`Client disconnected: ${socket.id}`);
        });

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

    return io;
}

export { initSocket };
