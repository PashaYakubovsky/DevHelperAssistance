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
// import usersRouter from "./routes/users";
import { Server } from "socket.io";
import axios from "axios";
// import { Server } from "socket.io";

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}

const app = express();

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
// app.use("/api/v1/users", usersRouter);
app.post("/api/v1/getSitePreview", (req, res) => {
    try {
        const body = req.body;

        debugger;
        const response = axios.post("https://cors-anywhere.herokuapp.com/" + body.url);
    } catch (err) {
        console.log(err);
    }
});

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

try {
const options = {
    passphrase: sslPassword,
    pfx: fs.readFileSync(path.join(__dirname, "STAR_inboost_ai.pfx")),
};
const httpsServer = https.createServer(options, app);
httpsServer.listen(port, bot);
console.log(`listening on port ${port}!`);
// }  {}

const httpServer = http.createServer(app);
httpServer.listen(String(+port - 1000));

// Web socket
const io = new Server(httpsServer, {
    cors: {
        origin: [
            "http://localhost:4200",
            "http://localhost:4201",
            "http://localhost:3000",
            "https://pashayakubovsky.netlify.app",
            "https://cors-anywhere.herokuapp.com",
            "http://localhost:24055",
            "https://1680-157-90-210-118.ngrok-free.app/",
            "https://*.ngrok-free.app/",
        ],
        methods: ["GET", "POST"],
    },
});

io.on("connection", socket => {
    console.log("User connected: " + socket.id);

    socket.on("disconnect", () => {
        console.log("user disconnected");
    });

    socket.on("message", args => {
        const message = args?.message;
        if (message) {
            io.emit("message", message);
        }
    });

    socket.on("image", args => {
        const imageData = args as {
            name?: string;
            type?: string;
            data?: string | ArrayBuffer | null;
            userId: string;
        };

        io.emit("image", imageData);
    });

    socket.on("typing", (args: { typing: boolean; user: { userId: string; name: string } }) => {
        io.emit("typing", args);
    });
});

io.listen(3000);

app.post("/change-3d-text", async (req, res) => {
    const { message } = req.body;

    io.emit("changeText", message ?? "test");

    res.status(200).send("Message received");
});
