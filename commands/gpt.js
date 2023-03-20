const { SlashCommandBuilder, EmbedBuilder } = require("discord.js");
const axios = require("axios");
const { inboostToken, secretView } = require("../config.json");

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
            // await interaction.reply("Loading...");
            await interaction.deferReply();

            const body = {
                Prompt,
                MaxTokens: typeof MaxTokens == "string" ? parseInt(MaxTokens ?? 100) : 100,
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

            if (_secret?.trim() === secretView) {
                // change view type ai bot answers
                MaxTokens = String(parseInt(MaxTokens));
                showDir = true;
            }
        } catch (err) {
            console.log(err);
        }

        console.log({ textToModel: Prompt, textFromMode: answer });

        if (!showDir) {
            const embed = new EmbedBuilder()
                .setTitle("OpenAI")
                .setURL("https://platform.openai.com/docs/introduction/overview")
                .setThumbnail(
                    "https://i.pinimg.com/564x/23/a6/76/23a67601c17f4606250e6b15d2592c12.jpg"
                )
                .addFields(splitTextIntoChunks(answer));

            await interaction.editReply({ embeds: [embed] });
        } else {
            await interaction.editReply(answer);
        }
    },
};

function splitTextIntoChunks(text) {
    const chunks = [];
    const maxLength = 1024;
    const length = text.length;
    let stepEmoji = "ノ( º  ºノ)";

    if (length > maxLength) {
        for (let i = 0; i < length; i += maxLength) {
            const chunk = text.substring(i, i + maxLength);

            const chunkObject = {
                name: stepEmoji,
                value: chunk,
            };

            stepEmoji = "┬─┬" + stepEmoji;

            chunks.push(chunkObject);
        }
    } else {
        chunks.push({
            name: "┬─┬ノ( º _ ºノ)",
            value: text,
        });
    }

    chunks.push({
        name: "info",
        value: `Text from OpenAI API, model=GPT3.5-turbo`,
    });

    return chunks;
}
