import express from "express";
import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { Request, Response } from "express";

const router = express.Router();

router.post("/logger", async (req: Request, res: Response) => {
    try {
        const body: { message?: string; error: Error } = req.body;
        await axios.post(
            "https://discord.com/api/webhooks/1092348638568652800/Gyf5rOD_pf6HSc4Hn1qSEhiSmdownjx7AQbPNl4zzPFtVFDsKoJRJwIloqS8XfTzMKHs",
            {
                embeds: [
                    new EmbedBuilder().setDescription("🚫 Oops! Something went wrong").setFields({
                        name: body.message ?? "_",
                        value: JSON.stringify(body.error),
                    }),
                ],
            }
        );
    } catch (error) {
        console.error(error);
        res.status(400).send(JSON.stringify(error));
    }

    res.send(200);
});

export default router;
