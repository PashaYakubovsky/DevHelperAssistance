const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("reddit")
        .setDescription("Get picture from reddit API")
        .addStringOption(option =>
            option
                .setName("subreddit")
                .setDescription("name community where i can find some cool pictures")
                .setRequired(false)
        )
        .addNumberOption(option =>
            option
                .setName("limit")
                .setDescription("how many posts from reddit get?")
                .setRequired(false)
        ),
    async execute(interaction) {
        const subredditName = interaction.options.data?.[0]?.value ?? "ProgrammerHumor";
        const limit = Number(interaction.options.data?.[1]?.value ?? 10);

        await interaction.deferReply();

        try {
            // Fetch the list of posts from the subreddit
            const response = await axios.get(
                `https://www.reddit.com/r/${subredditName}/hot.json?limit=${limit}`
            );

            const arr = response.data.data.children;
            const randomIndex = Math.floor(Math.random() * arr.length);
            const randomElement = arr.splice(randomIndex, 1)[0];

            await interaction.editReply(randomElement?.data?.url);
        } catch (err) {
            console.error(err);
            await interaction.editReply(err);
        }
    },
};
