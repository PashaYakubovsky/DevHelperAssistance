const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("where53")
        .setDescription("I can tell you where 53 port"),
    async execute(interaction) {
        const port = await axios.get("https://mhp.inboost.ai:5053/api/who", {
            headers: {
                Authorization: `bearer ${process.env.INBOOST_TOKEN}`,
            },
        });

        await interaction.reply(port.data);
    },
};
