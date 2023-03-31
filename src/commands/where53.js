const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { bearerToken } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("where53")
        .setDescription("I can tell you where 53 port"),
    async execute(interaction) {
        let who = "port is free!";

        try {
            // const port = await axios("https://mhp.inboost.ai:5053/api/who");
            const response = await axios.get("http://localhost:5050/api/who", {
                headers: {
                    Authorization: `bearer ${bearerToken}`,
                },
            });

            who = response.data;
        } catch (err) {
            console.log(err);
        }

        await interaction.reply(who);
    },
};
