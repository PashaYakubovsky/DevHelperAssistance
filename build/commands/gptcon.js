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
exports.execute = exports.data = void 0;
const discord_js_1 = require("discord.js");
const config_json_1 = require("../config.json");
const helper_1 = require("../helper/helper");
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("gptcon")
    .setDescription("Start the conversation with ChatGPT.")
    .addStringOption(option => option.setName("prompt").setDescription("text for gpt model").setRequired(true));
function execute(interaction) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        let answer = "error when trying to get the answer";
        const Prompt = (_b = (_a = interaction.options._hoistedOptions) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        const UserId = interaction.member.user.id;
        yield interaction.deferReply({ ephemeral: true });
        try {
            const body = {
                Prompt,
                UserId,
            };
            const agent = new https_1.default.Agent({
                rejectUnauthorized: false,
            });
            const response = yield axios_1.default.post(`${config_json_1.apiDomain}/api/v1/gpt-conversation`, body, {
                headers: {
                    Authorization: `Bearer ${config_json_1.bearerToken}`,
                },
                httpsAgent: agent,
            });
            answer = String((_e = (_d = (_c = response.data) === null || _c === void 0 ? void 0 : _c.Delta) === null || _d === void 0 ? void 0 : _d.Content) !== null && _e !== void 0 ? _e : "something wrong");
        }
        catch (err) {
            console.error(err);
        }
        console.log({ textToModel: Prompt, textFromMode: answer });
        if (answer.length > 1000) {
            const embed = new discord_js_1.EmbedBuilder()
                .setThumbnail("https://i.pinimg.com/564x/fd/20/2d/fd202d8e8cb8dcef1d30357e8309edc5.jpg")
                .addFields((0, helper_1.splitTextIntoChunks)(answer));
            yield interaction.editReply({ embeds: [embed] });
        }
        else {
            yield interaction.editReply(answer);
        }
    });
}
exports.execute = execute;
