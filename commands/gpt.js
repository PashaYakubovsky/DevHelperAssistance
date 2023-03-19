const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { inboostToken, secretMaxTokens, secretView } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gpt")
        .setDescription("Ask the ChatGPT.")
        .addStringOption(option =>
            option.setName("prompt").setDescription("text for gpt model").setRequired(true)
        )
        .addStringOption(option =>
            option.setName("tokens").setDescription("how many tokens?").setRequired(false)
        ),
    async execute(interaction) {
        let answer = "error when trying to get the answer";
        let secret = secretView;
        const Prompt = interaction.options._hoistedOptions?.[0]?.value;
        let MaxTokens = interaction.options._hoistedOptions?.[1]?.value;

        try {
            // await interaction.reply("Loading...");
            await interaction.deferReply();

            const body = {
                Prompt,
                MaxTokens: typeof MaxTokens == "string" ? parseInt(MaxTokens) : 100,
            };

            const response = await axios.post("https://8720-157-90-210-118.eu.ngrok.io/GPT", body, {
                headers: {
                    Authorization: `Bearer ${inboostToken}`,
                },
            });

            answer = String(response.data?.message?.content ?? "something wrong");
        } catch (err) {
            console.error(err);
        }

        try {
            const _secret = MaxTokens?.split(",")?.[1];
            if (_secret.trim() === secret) {
                // change view type ai bot answers
                MaxTokens = String(parseInt(MaxTokens));
                secret = null;
            }
        } catch (err) {
            console.log(err);
        }

        if (secret !== null) {
            const embed = new EmbedBuilder()
                .setTitle("OpenAI")
                .setURL("https://platform.openai.com/docs/introduction/overview")
                .setImage("https://i.pinimg.com/564x/23/a6/76/23a67601c17f4606250e6b15d2592c12.jpg")
                .addFields(splitTextIntoChunks(answer))
                .setFields({
                    name: "info",
                    value: `Text from OpenAI API, model=GPT3.5-turbo`,
                })
                .setFooter({
                    text: "Pasha Yakubovsky",
                });

            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply(answer);
        }
    },
};

function splitTextIntoChunks(text) {
    const chunks = [];
    const maxLength = 1024;

    for (let i = 0; i < text.length; i += maxLength) {
        const chunk = text.substring(i, i + maxLength);
        const chunkObject = {
            name: i % 2 === 0 ? "_ /( º  ºノ)" : "┬─┬ノ( º _ ºノ)",
            value: chunk,
        };
        chunks.push(chunkObject);
    }

    return chunks;
}
