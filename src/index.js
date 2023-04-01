const fs = require("node:fs");
const path = require("node:path");
const { Client, Collection, Events, GatewayIntentBits, EmbedBuilder } = require("discord.js");
const { token, port } = require("../config.json");
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const axios = require("axios");

const app = express();

// adding Helmet to enhance your Rest API's security
app.use(helmet());

// using bodyParser to parse JSON bodies into JS objects
app.use(bodyParser.json());

// enabling CORS for all requests
app.use(cors());

// adding morgan to log HTTP requests
app.use(morgan("combined"));

// defining an endpoint to return all ads
app.post("/api/v1/logger", async (req, res) => {
    try {
        await axios.post(
            "https://discord.com/api/webhooks/1091485210656391199/lqMXuDIgmAkzf653UTJLiKo64NRbt4DGdJ4HcpfEMRofGjdbmThQBj3DFY6f0Fw8Jofh",
            {
                embeds: [
                    new EmbedBuilder()
                        .setThumbnail(
                            "https://i.pinimg.com/564x/9b/5f/b6/9b5fb6bb1bbde69160dc24223baf53e0.jpg"
                        )
                        .setDescription("🚫 Oops! Something went wrong")
                        .setFields({
                            name: req.body?.message ?? "_",
                            value: JSON.stringify(req.body.error),
                        }),
                ],
            }
        );
    } catch (error) {
        console.error(error);
        res.status(400).send(JSON.stringify(error));
    }

    res.send(200);
});

// starting the server
app.listen(port ?? 25097, () => {
    const client = new Client({ intents: [GatewayIntentBits.Guilds] });
    client.commands = new Collection();
    const commandsPath = path.join(__dirname, "commands");
    const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith(".js"));

    for (const file of commandFiles) {
        const filePath = path.join(commandsPath, file);
        const command = require(filePath);
        client.commands.set(command.data?.name, command);
    }

    client.on(Events.InteractionCreate, async interaction => {
        if (!interaction.isChatInputCommand()) return;

        const command = client.commands.get(interaction.commandName);

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
});
