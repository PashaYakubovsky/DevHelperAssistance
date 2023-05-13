"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const helper_1 = require("../helper/helper");
const auth_1 = __importDefault(require("../middleware/auth"));
/**
 * Encapsulates the routes
 * @param {FastifyInstance} fastify  Encapsulated Fastify Instance
 * @param {Object} options plugin options, refer to https://www.fastify.io/docs/latest/Reference/Plugins/#plugin-options
 */
function routes(fastify, options) {
    return __awaiter(this, void 0, void 0, function* () {
        fastify.get("/api/v1/logger", { preHandler: auth_1.default }, (req, reply) => __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const agent = new https_1.default.Agent({
                    rejectUnauthorized: false,
                });
                const body = req.body;
                const json = JSON.stringify(body === null || body === void 0 ? void 0 : body.error, null, 4);
                let chunks = (0, helper_1.splitTextIntoChunks)(json, 1000);
                chunks = chunks.map(chunk => (Object.assign(Object.assign({}, chunk), { value: `\`\`\`json\n${chunk.value}\n\`\`\`` })));
                const embed = new discord_js_1.EmbedBuilder()
                    .setDescription("🚫 Oops! Something went wrong")
                    .setTitle((_a = body === null || body === void 0 ? void 0 : body.message) !== null && _a !== void 0 ? _a : "_")
                    .setFields(chunks);
                const origin = req.headers["origin"];
                const isDev = origin.includes("localhost");
                yield axios_1.default.post(`https://discord.com/api/webhooks/${isDev
                    ? "1091485210656391199/lqMXuDIgmAkzf653UTJLiKo64NRbt4DGdJ4HcpfEMRofGjdbmThQBj3DFY6f0Fw8Jofh"
                    : "1092348638568652800/Gyf5rOD_pf6HSc4Hn1qSEhiSmdownjx7AQbPNl4zzPFtVFDsKoJRJwIloqS8XfTzMKHs"}`, {
                    embeds: [embed],
                }, {
                    httpsAgent: agent,
                });
            }
            catch (error) {
                console.error(error);
                return reply.status(400).send(JSON.stringify(error));
            }
            return reply.send(200);
        }));
    });
}
exports.default = routes;
