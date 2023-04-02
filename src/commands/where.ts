import { SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { bearerToken } from "../config.json";

export const data = new SlashCommandBuilder()
    .setName("where")
    .setDescription("I can tell you where {{yours}} port")
    .addStringOption(option =>
        option.setName("port").setDescription("specific port").setRequired(true)
    );
export async function execute(interaction: any) {
    await interaction.deferReply();

    let who = "port is free!";
    let port = interaction.options.data?.find(
        (option: { name: string }) => option?.name === "port"
    )?.value;

    // if (port !== "5053") port = String(parseInt(port) - 1000);

    try {
        // const port = await axios("https://mhp.inboost.ai:5053/api/who");
        const response = await axios.get(`https://localhost:${port}/api/who`, {
            headers: {
                Authorization: `bearer ${bearerToken}`,
            },
        });

        who = response.data;
    } catch (err) {
        console.log(err);
    }

    await interaction.editReply(who);
}
