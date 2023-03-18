const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder().setName("gpt").setDescription("Ask the ChatGPT."),
    async execute(interaction) {
        let answer = "";

        try {
            const response = await axios.post("http://localhost:24056", {
                Prompt: interaction,
            });

            answer = response.data?.Text;
        } catch (err) {
            console.error(err);
        }

        await interaction.reply(answer);
    },
};
