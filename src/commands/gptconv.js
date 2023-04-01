const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { apiKey, apiDomain } = require("../../config.json");
const { splitTextIntoChunks } = require("../helper/helper");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("gptcon")
        .setDescription("Start the conversation with ChatGPT.")
        .addStringOption(option =>
            option.setName("prompt").setDescription("text for gpt model").setRequired(true)
        ),
    async execute(interaction) {
        let answer = "error when trying to get the answer";
        const Prompt = interaction.options._hoistedOptions?.[0]?.value;
        const UserId = interaction.member.user.id;

        await interaction.deferReply({ ephemeral: true });

        try {
            const body = {
                Prompt,
                UserId,
            };

            const response = await axios.post(`${apiDomain}/api/v1/gpt-conversation`, body, {
                headers: {
                    "X-Api-key": `${apiKey}`,
                },
            });

            answer = String(response.data?.Delta?.Content ?? "something wrong");
        } catch (err) {
            console.error(err);
        }

        console.log({ textToModel: Prompt, textFromMode: answer });

        if (answer.length > 1000) {
            const embed = new EmbedBuilder()
                .setThumbnail(
                    "https://i.pinimg.com/564x/fd/20/2d/fd202d8e8cb8dcef1d30357e8309edc5.jpg"
                )
                .addFields(splitTextIntoChunks(answer));

            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply(answer);
        }
        // }
    },
};
