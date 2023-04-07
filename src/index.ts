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
import loggerRouter from "./controllers/logger";

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
    console.log(`listening on port ${port}!`)

} catch {
    const httpServer = http.createServer(app);
    httpServer.listen(+port - 1000, bot);
}
