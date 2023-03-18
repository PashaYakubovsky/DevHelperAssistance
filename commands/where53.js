const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { inboostToken } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("where53")
        .setDescription("I can tell you where 53 port"),
    async execute(interaction) {
        try {

        } catch(err) {}
        const port = await axios.get("https://mhp.inboost.ai:5053/api/who", {
            headers: {
                Authorization: `bearer ${inboostToken}`,
            },
        });

        await interaction.reply(port.data);
    },
};
