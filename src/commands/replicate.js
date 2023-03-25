const { SlashCommandBuilder, Client, GatewayIntentBits } = require("discord.js");
const { replicateStartHandler, replicateEndHandler } = require("../helper/helper");
const { token, channelId } = require("../../config.json");

const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("replicate")
        .setDescription("Generate picture with Replicate")
        .addStringOption(option =>
            option.setName("prompt").setDescription("text ot generate image").setRequired(true)
        ),
    async execute(interaction) {
        const client = new Client({ intents: [GatewayIntentBits.Guilds] });

        await client.login(token);

        const prompt = interaction.options.data?.find(option => option?.name === "prompt")?.value;

        if (prompt) {
            await interaction.deferReply();

            const predictionInit = await replicateStartHandler(prompt);

            let flag = true;

            await sleep(10000);

            let prediction = await replicateEndHandler(predictionInit.id);

            while (flag) {
                if (prediction.status === "succeeded") {
                    const channel = client.channels.cache.get(channelId);
                    await channel.send(prediction.output[0]);
                    await interaction.editReply();
                    flag = false;
                }

                await sleep(10000);
                prediction = await replicateEndHandler(predictionInit.id);
            }

            try {
            } catch (err) {
                console.error(err);
            }
        }
    },
};
