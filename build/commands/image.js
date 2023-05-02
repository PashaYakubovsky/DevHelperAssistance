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
const https_1 = __importDefault(require("https"));
const discord_js_1 = require("discord.js");
const axios_1 = __importDefault(require("axios"));
const config_json_1 = require("../config.json");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("image")
    .setDescription("make something with image")
    .addStringOption(option => option.setName("prompt").setDescription("what you want to do with image?").setRequired(true));
function execute(interaction) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.deferReply();
        const prompt = interaction.options.data.find(option => (option === null || option === void 0 ? void 0 : option.name) === "prompt").value;
        const user = interaction.user.id;
        if (prompt) {
            try {
                const agent = new https_1.default.Agent({
                    rejectUnauthorized: false,
                });
                const response = yield axios_1.default.post(`${config_json_1.apiDomain}/api/v1/image`, {
                    Prompt: prompt,
                    User: user,
                }, {
                    headers: {
                        Authorization: "Bearer " + config_json_1.bearerToken,
                    },
                    httpsAgent: agent,
                });
                yield interaction.editReply((_b = (_a = response.data) === null || _a === void 0 ? void 0 : _a[0]) === null || _b === void 0 ? void 0 : _b.Url);
            }
            catch (err) {
                console.error(err);
                yield interaction.editReply(err);
            }
        }
    });
}
exports.execute = execute;
