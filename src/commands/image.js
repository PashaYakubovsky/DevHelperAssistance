const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { apiDomain, bearerToken } = require("../../config.json");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("imagecr")
        .setDescription("make something with image")
        .addStringOption(option =>
            option
                .setName("prompt")
                .setDescription("what you want to do with image?")
                .setRequired(true)
        ),
    // .addAttachmentOption(option =>
    //     option.setRequired(true).setName("image").setDescription("The image to dither")
    // ),
    async execute(interaction) {
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
    },
};
