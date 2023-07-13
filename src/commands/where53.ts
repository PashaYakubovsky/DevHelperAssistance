import { SlashCommandBuilder } from "discord.js";
import axios from "axios";
import { bearerToken } from "../config.json";

const translate = async (text: string): Promise<string> => {
    try {
        let res = await axios.get(
            `https://api.mymemory.translated.net/get?q=${text}&langpair=ru|uk`
        );
        let translation = res.data.responseData.translatedText as string;
        return translation;
    } catch (err) {
        console.error(err);
    }

    return text;
};

export const data = new SlashCommandBuilder()
    .setName("where53")
    .setDescription("I can tell you where 53 port");
export async function execute(interaction: any) {
    let who = "port is free!";

    await interaction.deferReply();

    try {
        const response = await axios.get("https://mhp.inboost.ai:5053/api/Who", {
            headers: {
                Authorization: `bearer ${bearerToken}`,
            },
        });
        who = await translate(response.data);
    } catch (err) {
        console.log(err);
    }

    await interaction.editReply(who);
}
