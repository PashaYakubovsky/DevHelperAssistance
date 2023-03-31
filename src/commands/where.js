const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { bearerToken } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("where")
        .setDescription("I can tell you where {{yours}} port")
        .addStringOption(option =>
            option.setName("port").setDescription("specific port").setRequired(true)
        ),
    async execute(interaction) {
        await interaction.deferReply();

        let who = "port is free!";
        let port = interaction.options.data?.find(option => option?.name === "port")?.value;

        // if (port !== "5053") port = String(parseInt(port) - 1000);

        try {
            // const port = await axios("https://mhp.inboost.ai:5053/api/who");
            const response = await axios.get(`https://mhp.inboost.ai:${port}/api/who`, {
                headers: {
                    Authorization: `bearer ${bearerToken}`,
                },
            });

            who = response.data;
        } catch (err) {
            console.log(err);
        }

        await interaction.editReply(who);
    },
};
