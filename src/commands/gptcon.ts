import {
    SlashCommandBuilder,
    EmbedBuilder,
    MessageContextMenuCommandInteraction,
} from "discord.js";
import { apiDomain, bearerToken } from "../config.json";
import { splitTextIntoChunks } from "../helper/helper";
import https from "https";
import axios from "axios";

export const data = new SlashCommandBuilder()
    .setName("gptcon")
    .setDescription("Start the conversation with ChatGPT.")
    .addStringOption(option =>
        option.setName("prompt").setDescription("text for gpt model").setRequired(true)
    );

export async function execute(interaction: MessageContextMenuCommandInteraction) {
    let answer = "error when trying to get the answer";
    const userId = interaction.member.user.id;
    let prompt = interaction.options.data.find(predicate => predicate.name === "prompt").value;

    await interaction.deferReply({ ephemeral: true });

    try {
        const body = {
            Prompt: prompt,
            UserId: userId,
        };

        const agent = new https.Agent({
            rejectUnauthorized: false,
        });

        const response = await axios.post(`${apiDomain}/api/v1/gpt-conversation`, body, {
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
    // }
}
