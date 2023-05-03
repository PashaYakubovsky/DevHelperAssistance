import https from "https";
import http from "http";
import { Interaction, Client, Events, GatewayIntentBits } from "discord.js";
import fs from "node:fs";
import path from "node:path";
import { token, port, sslPassword } from "./config.json";
import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import * as commandModules from "./commands";
import loggerRouter from "./routes/logger";
import usersRouter from "./routes/users";
import chatRouter from "./routes/chat";
import { Server } from "socket.io";
// import axios from "axios";
import firebase from "firebase/app";
import "firebase/storage";
import db from "./db/config";
import authRouter from "./routes/auth";
import { v4 as uuid } from "uuid";

// import { Server } from "socket.io";

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
};;

const app = express();

require("dotenv").config();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// settings the routes for api
app.use("/api/v1", loggerRouter);
app.use("/api/v1", usersRouter);
app.use("/api/v1", chatRouter);
app.use("/api/v1", authRouter);

app.post("/change-3d-text", async (req, res) => {
    const { message } = req.body;

    io.emit("changeText", message ?? "test");

    res.status(200).send("Message received");
});
// app.use("/api/v1/users", usersRouter);
// app.post("/api/v1/getSitePreview", (req, res) => {
//     try {
//         const body = req.body;

//         const response = axios.post("https://cors-anywhere.herokuapp.com/" + body.url);
//     } catch (err) {
//         console.log(err);
//     }
// });
const bot = () => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });

    client.on(Events.InteractionCreate, async (interaction: Interaction) => {
        if (!interaction.isChatInputCommand()) return;

        const command = commandModules[interaction.commandName];

        if (!command) return;

        try {
            await command.execute(interaction);
        } catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                await interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            } else {
                await interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    });

    client.login(token);
};

// try {
/*
const options = {
    passphrase: sslPassword,
    pfx: fs.readFileSync(path.join(__dirname, "STAR_inboost_ai.pfx")),
};
*/
const httpServer = http.createServer(app);
httpServer.listen(port, bot);
console.log(`listening on port ${port}!`);
// }  {}

// const httpServer = http.createServer(app);
// httpServer.listen(String(+port - 1000));

// Web socket
const io = new Server(httpServer, {
    cors: {
        origin: "*",
        methods: ["GET", "POST", "PUT"],
    },
});

io.on("connection", async socket => {
    console.log("User connected: " + socket.id);
    // const doc = (await db.collection("Online").get()).docs[0];
    // let counter = doc.data()?.count as number;
    // await db.collection("Online").doc(doc.id).update({ count: counter });

    socket.on("disconnect", async () => {
        console.log("user disconnected");
    });

    socket.on("closed", async () => {
        console.log("socket closed");
    });

    socket.on("message", async args => {
        const message = args?.message;
        if (message) {
            io.emit("message", message);

            await db.collection("Messages").add(message);
        }
    });

    socket.on("image", args => {
        const imageData = args as {
            name?: string;
            type?: string;
            data?: File;
            user?: any;
        };

        io.emit("image", imageData);

        // const buffer = imageData?.data ?? "";
        // const blob = new Blob([buffer], { type: imageData.type });

        // const storage = firebase.getApp();
        // const storageRef = ref(storage, imageData?.name);

        // uploadBytes(storageRef, imageData?.data)?.then(snapshot => {
        //     console.log("Uploaded a blob or file!");
        // });

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
        io.emit("typing", args);
    });
});

io.listen(3000);
