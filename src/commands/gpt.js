const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const { bearerToken, secretView, apiDomain } = require("../../config.json");
// const { api } = require("../api/createApi");
const https = require("https");
const axios = require("axios");
const { secretView, apiDomain } = require("../../config.json");
const { splitTextIntoChunks } = require("../helper/helper");

if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}

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
        let showDir = false;
        const Prompt = interaction.options._hoistedOptions?.[0]?.value;
        let MaxTokens = interaction.options._hoistedOptions?.[1]?.value;

        try {
            const _secret = MaxTokens?.split(",")?.[1];

            if (_secret?.trim() === secretView) {
                // change view type ai bot answers
                MaxTokens = String(parseInt(MaxTokens));
                showDir = true;
            }
        } catch (err) {
            console.log(err);
        }

        await interaction.deferReply({ ephemeral: !showDir });

        try {
            // await interaction.reply("Loading...");

            const body = {
                Prompt,
                MaxTokens: typeof MaxTokens == "string" ? parseInt(MaxTokens ?? 100) : 1000,
            };

            const agent = new https.Agent({
                rejectUnauthorized: false,
            });

            const response = await axios.post(`${apiDomain}/api/v1/gpt`, body, {
                headers: {
                    Authorization: `Bearer ${bearerToken}`,
                },
                httpsAgent: agent,
            });

            answer = String(response.data?.Delta?.Content ?? "something wrong");
        } catch (err) {
            console.error(err);
        }

        console.log({ textToModel: Prompt, textFromMode: answer });

        // if (!showDir) {

        // } else {
        if (answer.length > 1000) {
            // const chunks = splitTextIntoChunks(answer, 1000);

            // // await interaction.editReply(chunks[0]);
            // const unshift = chunks.filter((_, idx) => _.length);
            // //  idx !== 0 &&

            // for (const chunk of unshift) {
            //     await interaction.followUp(chunk);
            // }
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
