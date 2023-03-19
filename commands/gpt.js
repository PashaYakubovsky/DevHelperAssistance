const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { inboostToken, secretMaxTokens } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gpt")
        .setDescription("Ask the ChatGPT.")
        .addStringOption(option =>
            option.setName("prompt").setDescription("text for gpt model").setRequired(true)
        )
        .addStringOption(option => option.setName("AImax")),
    async execute(interaction) {
        let answer = "error when trying to get the answer";

        try {
            const Prompt = interaction.options._hoistedOptions?.[0]?.value;
            const passForAIMaxOption = interaction.options._hoistedOptions?.[1]?.value;

            // await interaction.reply("Loading...");
            await interaction.deferReply();

            const response = await axios.post(
                "https://8720-157-90-210-118.eu.ngrok.io/GPT",
                {
                    Prompt,
                    MaxTokens: passForAIMaxOption === secretMaxTokens ? 4000 : 100,
                },
                {
                    headers: {
                        Authorization: `Bearer ${inboostToken}`,
                    },
                }
            );

            answer = Array.isArray(response.data)
                ? response.data.reduce((acc, cur) => acc + "\n" + cur.text, "")
                : response.data.text;
        } catch (err) {
            console.error(err);
        }
        // await interaction.deferReply(answer);
        // await interaction.reply(answer);
        // await interaction.reply({ content: answer, fetchReply: true });
        // await interaction.followUp(answer);
        await interaction.editReply(answer);
    },
};
