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
const axios_1 = __importDefault(require("axios"));
const config_json_1 = require("../config.json");
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("where")
    .setDescription("I can tell you where {{yours}} port")
    .addStringOption(option => option.setName("port").setDescription("specific port").setRequired(true));
function execute(interaction) {
    var _a, _b;
    return __awaiter(this, void 0, void 0, function* () {
        yield interaction.deferReply();
        let who = "port is free!";
        let port = (_b = (_a = interaction.options.data) === null || _a === void 0 ? void 0 : _a.find((option) => (option === null || option === void 0 ? void 0 : option.name) === "port")) === null || _b === void 0 ? void 0 : _b.value;
        // if (port !== "5053") port = String(parseInt(port) - 1000);
        try {
            // const port = await axios("https://mhp.inboost.ai:5053/api/who");
            const response = yield axios_1.default.get(`https://localhost:${port}/api/who`, {
                headers: {
                    Authorization: `bearer ${config_json_1.bearerToken}`,
                },
            });
            who = response.data;
        }
        catch (err) {
            console.log(err);
        }
        yield interaction.editReply(who);
    });
}
exports.execute = execute;
