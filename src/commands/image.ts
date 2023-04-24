import https from "https";
import { MessageContextMenuCommandInteraction, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { apiDomain, bearerToken } from "../config.json";

export const data = new SlashCommandBuilder()
    .setName("image")
    .setDescription("make something with image")
    .addStringOption(option =>
        option.setName("prompt").setDescription("what you want to do with image?").setRequired(true)
    );

export async function execute(interaction: MessageContextMenuCommandInteraction) {
    await interaction.deferReply();
    const prompt = interaction.options.data.find(option => option?.name === "prompt").value;
    const user = interaction.user.id;

    if (prompt) {
        try {
            const agent = new https.Agent({
                rejectUnauthorized: false,
            });

            const response = await axios.post(
                `${apiDomain}/api/v1/image`,
                {
                    Prompt: prompt,
                    User: user,
                },
                {
                    headers: {
                        Authorization: "Bearer " + bearerToken,
                    },
                    httpsAgent: agent,
                }
            );

            await interaction.editReply(response.data?.[0]?.Url);
        } catch (err) {
            console.error(err);
            await interaction.editReply(err);
        }
    }
}
