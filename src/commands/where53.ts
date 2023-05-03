import { SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { bearerToken } from "../config.json";

export const data = new SlashCommandBuilder()
    .setName("where53")
    .setDescription("I can tell you where 53 port");
export async function execute(interaction: any) {
    let who = "port is free!";

    await interaction.deferReply();

    try {
        // const port = await axios("https://mhp.inboost.ai:5053/api/who");
        const response = await axios.get("http://localhost:5050/api/who", {
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
