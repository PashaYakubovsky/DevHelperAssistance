import { SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { apiDomain, bearerToken } from "../config.json";

export const data = new SlashCommandBuilder()
    .setName("imagecr")
    .setDescription("make something with image")
    .addStringOption(option =>
        option.setName("prompt").setDescription("what you want to do with image?").setRequired(true)
    );

export async function execute(interaction: {
    deferReply: () => Promise<void>;
    options: { data: { name: string; value: unknown }[] };
    user: { id: string };
    editReply: (arg0: unknown) => any;
}) {
    await interaction.deferReply();
    const prompt = interaction.options.data?.find(option => option?.name === "prompt")?.value;
    const user = interaction.user.id;
    // const attachment = interaction.options.getAttachment("image");
    // const url = attachment.url;

    if (prompt) {
        try {
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
                }
            );

            await interaction.editReply(response.data?.[0]?.Url);
        } catch (err) {
            console.error(err);
            await interaction.editReply(err);
        }
    }
}
