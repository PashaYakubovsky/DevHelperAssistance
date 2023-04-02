import express from "express";
import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { Request, Response } from "express";

const router = express.Router();

router.post("/logger", async (req: Request, res: Response) => {
    try {
        const body: { message: string; error: Error } = req.body;
        await axios.post(
            "https://discord.com/api/webhooks/1091485210656391199/lqMXuDIgmAkzf653UTJLiKo64NRbt4DGdJ4HcpfEMRofGjdbmThQBj3DFY6f0Fw8Jofh",
            {
                embeds: [
                    new EmbedBuilder()
                        .setThumbnail(
                            "https://i.pinimg.com/564x/9b/5f/b6/9b5fb6bb1bbde69160dc24223baf53e0.jpg"
                        )
                        .setDescription("🚫 Oops! Something went wrong")
                        .setFields({
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
