const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { inboostToken, secretMaxTokens } = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gpt")
        .setDescription("Ask the ChatGPT.")
        .addStringOption(option =>
            option.setName("prompt").setDescription("text for gpt model").setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("aimax")
                .setDescription("secret for max tokens in output")
                .setRequired(false)
        ),
    async execute(interaction) {
        let answer = "error when trying to get the answer";

        try {
            const Prompt = interaction.options._hoistedOptions?.[0]?.value;
            const passForAIMaxOption = interaction.options._hoistedOptions?.[1]?.value;

            // await interaction.reply("Loading...");
            await interaction.deferReply();

            const body = {
                Prompt,
                MaxTokens: passForAIMaxOption === secretMaxTokens ? 4000 : 100,
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
        // await interaction.deferReply(answer);
        // await interaction.reply(answer);
        // await interaction.reply({ content: answer, fetchReply: true });
        // await interaction.followUp(answer);

        const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("OpenAI")
            .setURL("https://platform.openai.com/docs/introduction/overview")
            .setAuthor({
                name: "Pasha Yakubovsky",
            })
            .setImage("https://i.pinimg.com/564x/a3/2e/c0/a32ec0f7090323b08e74abd035dcff86.jpg")
            .setDescription(`Text from OpenAI API, model=GPT3.5-turbo`)
            .addFields(splitTextIntoChunks(answer))
            .setTimestamp();

        await interaction.editReply({ embeds: [embed] });
    },
};

function splitTextIntoChunks(text) {
    const chunks = [];
    const maxLength = 1024;

    for (let i = 0; i < text.length; i += maxLength) {
        const chunk = text.substring(i, i + maxLength);
        const chunkIndex = Math.floor(i / maxLength);
        const chunkObject = {
            name: text.length > 1 ? `part ${chunkIndex + 1}` : "answer",
            value: chunk,
        };
        chunks.push(chunkObject);
    }

    return chunks;
}
