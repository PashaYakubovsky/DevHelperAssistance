import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction } from "discord.js";
import { bearerToken, secretView, apiDomain } from "../config.json";
import https from "https";
import axios from "axios";
import { splitTextIntoChunks } from "../helper/helper";

export type DirectOptionInteraction = { options: { _hoistedOptions: { value: unknown }[] } };

export const data = new SlashCommandBuilder()
    .setName("gpt")
    .setDescription("Ask the ChatGPT.")
    .addStringOption(option =>
        option.setName("prompt").setDescription("text for gpt model").setRequired(true)
    )
    .addStringOption(option =>
        option.setName("tokens").setDescription("how many tokens?").setRequired(false)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
    let answer = "error when trying to get the answer";
    let showDir = false;
    let maxTokens = interaction.options.data.find(predicate => predicate.name === "tokens")?.value;
    let prompt = interaction.options.data.find(predicate => predicate.name === "prompt").value;

    try {
        if (typeof maxTokens === "string") {
            const _secret = maxTokens?.split(",")?.[1];

            if (_secret?.trim() === secretView) {
                // change view type ai bot answers
                maxTokens = String(parseInt(maxTokens));
                showDir = true;
            }
        }
    } catch (err) {
        console.log(err);
    }

    await interaction.deferReply({ ephemeral: !showDir });

    try {
        const body = {
            Prompt: prompt,
            MaxTokens: typeof maxTokens == "string" ? parseInt(maxTokens ?? "100") : 1000,
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

    console.log({ textToModel: prompt, textFromMode: answer });

    if (answer.length > 1000) {
        const embed = new EmbedBuilder()
            .setThumbnail("https://i.pinimg.com/564x/fd/20/2d/fd202d8e8cb8dcef1d30357e8309edc5.jpg")
            .addFields(splitTextIntoChunks(answer));

        await interaction.editReply({ embeds: [embed] });
    } else {
        await interaction.editReply(answer);
    }
}
