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
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const discord_js_1 = require("discord.js");
const router = express_1.default.Router();
router.post("/logger", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        console.log(req);
        const agent = new https_1.default.Agent({
            rejectUnauthorized: false,
        });
        const body = req.body;
        yield axios_1.default.post(
        // "https://discord.com/api/webhooks/1091485210656391199/lqMXuDIgmAkzf653UTJLiKo64NRbt4DGdJ4HcpfEMRofGjdbmThQBj3DFY6f0Fw8Jofh",
        "https://discord.com/api/webhooks/1092348638568652800/Gyf5rOD_pf6HSc4Hn1qSEhiSmdownjx7AQbPNl4zzPFtVFDsKoJRJwIloqS8XfTzMKHs", {
            embeds: [
                new discord_js_1.EmbedBuilder().setDescription("🚫 Oops! Something went wrong").setFields({
                    name: (_a = body.message) !== null && _a !== void 0 ? _a : "_",
                    value: `\`\`\`json\n${JSON.stringify(body.error, null, 4)}\n\`\`\``,
                }),
            ],
        }, {
            httpsAgent: agent,
        });
    }
    catch (error) {
        console.error(error);
        res.status(400).send(JSON.stringify(error));
    }
    res.send(200);
}));
exports.default = router;
