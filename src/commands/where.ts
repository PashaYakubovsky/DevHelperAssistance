import { ContextMenuCommandInteraction, SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { bearerToken } from "../config.json";

export const data = new SlashCommandBuilder()
    .setName("where")
    .setDescription("I can tell you where {{yours}} port")
    .addStringOption(option =>
        option.setName("port").setDescription("specific port").setRequired(true)
    );
export async function execute(interaction: ContextMenuCommandInteraction) {
    await interaction.deferReply();

    let who = "port is free!";
    let port = interaction.options.data.find(option => option?.name === "port").value;

    try {
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
