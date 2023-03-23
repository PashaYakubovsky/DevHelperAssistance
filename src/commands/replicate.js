const { SlashCommandBuilder } = require("discord.js");
const axios = require("axios");
const { replicateStartHandler, replicateEndHandler } = require("../helper/helper");

const sleep = ms => new Promise(r => setTimeout(r, ms));

module.exports = {
    data: new SlashCommandBuilder()
        .setName("replicate")
        .setDescription("Generate picture with Replicate")
        .addStringOption(option =>
            option.setName("prompt").setDescription("text ot generate image").setRequired(true)
        ),
    async execute(interaction) {
        console.log("start", new Date().toISOString());
        const prompt = interaction.options.data?.find(option => option?.name === "prompt")?.value;

        if (prompt) {
            const predictionInit = await replicateStartHandler(prompt);

            let flag = true;

            await sleep(2000);

            let prediction = await replicateEndHandler(predictionInit.id);

            if (prediction.status === "succeeded") {
                flag = false;
            }

            while (flag) {
                await sleep(2000);

                prediction = await replicateEndHandler(predictionInit.id);

                if (prediction.status === "succeeded") {
                    await interaction.editReply(prediction.output[0]);
                    flag = false;
                }
            }

            try {
            } catch (err) {
                console.error(err);
            }
        }
    },
};
