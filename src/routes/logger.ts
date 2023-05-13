import https from "https";
import axios from "axios";
import { EmbedBuilder } from "discord.js";
import { splitTextIntoChunks } from "../helper/helper";
import { FastifyInstance } from "fastify";
import verifyToken from "../middleware/auth";

/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */

async function routes(fastify: FastifyInstance, options: object) {
    fastify.get("/api/v1/logger", { preHandler: verifyToken }, async (req, reply) => {
        try {
            const agent = new https.Agent({
                rejectUnauthorized: false,
            });
            const body = req.body as { error?: string; message?: string };
            const json = JSON.stringify(body?.error, null, 4);
            let chunks = splitTextIntoChunks(json, 1000);
            chunks = chunks.map(chunk => ({
                ...chunk,
                value: `\`\`\`json\n${chunk.value}\n\`\`\``,
            }));
            const embed = new EmbedBuilder()
                .setDescription("🚫 Oops! Something went wrong")
                .setTitle(body?.message ?? "_")
                .setFields(chunks);
            const origin = req.headers["origin"];
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
            return reply.status(400).send(JSON.stringify(error));
        }

        return reply.send(200);
    });
}

export default routes;
