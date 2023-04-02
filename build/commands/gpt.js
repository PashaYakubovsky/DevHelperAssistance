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
const https_1 = __importDefault(require("https"));
const axios_1 = __importDefault(require("axios"));
const helper_1 = require("../helper/helper");
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("gpt")
    .setDescription("Ask the ChatGPT.")
    .addStringOption(option => option.setName("prompt").setDescription("text for gpt model").setRequired(true))
    .addStringOption(option => option.setName("tokens").setDescription("how many tokens?").setRequired(false));
function execute(interaction) {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    return __awaiter(this, void 0, void 0, function* () {
        let answer = "error when trying to get the answer";
        let showDir = false;
        const Prompt = (_b = (_a = interaction.options._hoistedOptions) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.value;
        let MaxTokens = (_d = (_c = interaction.options._hoistedOptions) === null || _c === void 0 ? void 0 : _c[1]) === null || _d === void 0 ? void 0 : _d.value;
        try {
            const _secret = (_e = MaxTokens === null || MaxTokens === void 0 ? void 0 : MaxTokens.split(",")) === null || _e === void 0 ? void 0 : _e[1];
            if ((_secret === null || _secret === void 0 ? void 0 : _secret.trim()) === config_json_1.secretView) {
                // change view type ai bot answers
                MaxTokens = String(parseInt(MaxTokens));
                showDir = true;
            }
        }
        catch (err) {
            console.log(err);
        }
        yield interaction.deferReply({ ephemeral: !showDir });
        try {
            // await interaction.reply("Loading...");
            const body = {
                Prompt,
                MaxTokens: typeof MaxTokens == "string" ? parseInt(MaxTokens !== null && MaxTokens !== void 0 ? MaxTokens : "100") : 1000,
            };
            const agent = new https_1.default.Agent({
                rejectUnauthorized: false,
            });
            const response = yield axios_1.default.post(`${config_json_1.apiDomain}/api/v1/gpt`, body, {
                headers: {
                    Authorization: `Bearer ${config_json_1.bearerToken}`,
                },
                httpsAgent: agent,
            });
            answer = String((_h = (_g = (_f = response.data) === null || _f === void 0 ? void 0 : _f.Delta) === null || _g === void 0 ? void 0 : _g.Content) !== null && _h !== void 0 ? _h : "something wrong");
        }
        catch (err) {
            console.error(err);
        }
        console.log({ textToModel: Prompt, textFromMode: answer });
        // if (!showDir) {
        // } else {
        if (answer.length > 1000) {
            // const chunks = splitTextIntoChunks(answer, 1000);
            // // await interaction.editReply(chunks[0]);
            // const unshift = chunks.filter((_, idx) => _.length);
            // //  idx !== 0 &&
            // for (const chunk of unshift) {
            //     await interaction.followUp(chunk);
            // }
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
