import https from "https";
import express from "express";
import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { Request, Response } from "express";

const router = express.Router();

router.post("/logger", async (req: Request, res: Response) => {
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false,
        });
        const body: { message?: string; error: string } = req.body;
        await axios.post(
            // "https://discord.com/api/webhooks/1091485210656391199/lqMXuDIgmAkzf653UTJLiKo64NRbt4DGdJ4HcpfEMRofGjdbmThQBj3DFY6f0Fw8Jofh",
            "https://discord.com/api/webhooks/1092348638568652800/Gyf5rOD_pf6HSc4Hn1qSEhiSmdownjx7AQbPNl4zzPFtVFDsKoJRJwIloqS8XfTzMKHs",
            {
                embeds: [
                    new EmbedBuilder().setDescription("🚫 Oops! Something went wrong").setFields({
                        name: body.message ?? "_",
                        value: `\`\`\`json\n${JSON.stringify(body.error, null, 4)}\n\`\`\``,
                    }),
                ],
            },
            {
                httpsAgent: agent,
            }
        );
    } catch (error) {
        console.error(error);
        res.status(400).send(JSON.stringify(error));
    }

    res.send(200);
});

export default router;
