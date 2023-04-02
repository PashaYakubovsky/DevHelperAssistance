import { Interaction, MessageContextMenuCommandInteraction, SlashCommandBuilder } from "discord.js";
import axios from "axios";

export const data = new SlashCommandBuilder()
    .setName("reddit")
    .setDescription("Get picture from reddit API")
    .addStringOption(option =>
        option
            .setName("subreddit")
            .setDescription("name community where i can find some cool pictures")
            .setRequired(false)
    )
    .addNumberOption(option =>
        option.setName("limit").setDescription("how many posts from reddit get?").setRequired(false)
    );
export async function execute(interaction: MessageContextMenuCommandInteraction) {
    const subredditName =
        interaction.options.data.find(option => option.name === "subreddit")?.value ??
        "ProgrammerHumor";
    const limit = Number(
        interaction.options.data.find(option => option.name === "limit")?.value ?? 10
    );

    await interaction.deferReply();

    try {
        // Fetch the list of posts from the subreddit
        const response = await axios.get(
            `https://www.reddit.com/r/${subredditName}/new.json?limit=${limit}`
        );

        const arr = response.data.data.children;
        const randomIndex = Math.floor(Math.random() * arr.length);
        const randomElement = arr.splice(randomIndex, 1)[0];

        await interaction.editReply(randomElement?.data?.url);
    } catch (err) {
        console.error(err);
        await interaction.editReply(err);
    }
}
