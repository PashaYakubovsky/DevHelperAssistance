import https from "https";
import express from "express";
import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { Request, Response } from "express";
import { splitTextIntoChunks } from "../helper/helper";

const router = express.Router();

router.post("/logger", async (req: Request, res: Response) => {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });
        const body: { message?: string; error: string } = req.body;
        const json = JSON.stringify(body?.error, null, 4);
        let chunks = splitTextIntoChunks(json, 1000);
        chunks = chunks.map(chunk => ({ ...chunk, value: `\`\`\`json\n${chunk.value}\n\`\`\`` }));
        const embed = new EmbedBuilder()
            .setDescription("🚫 Oops! Something went wrong")
            .setTitle(body?.message ?? "_")
            .setFields(chunks);
        const origin = req.get("origin");
        const isDev = origin.includes("localhost");

        await axios.post(
            `https://discord.com/api/webhooks/${
                isDev
                    ? "1091485210656391199/lqMXuDIgmAkzf653UTJLiKo64NRbt4DGdJ4HcpfEMRofGjdbmThQBj3DFY6f0Fw8Jofh"
                    : "1092348638568652800/Gyf5rOD_pf6HSc4Hn1qSEhiSmdownjx7AQbPNl4zzPFtVFDsKoJRJwIloqS8XfTzMKHs"
            }`,
            {
                embeds: [embed],
            },
            {
                httpsAgent: agent,
            }
        );
    } catch (error) {
        console.error(error);
        return res.status(400).send(JSON.stringify(error));
    }

    return res.send(200);
});

export default router;
