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
    .setName("where53")
    .setDescription("I can tell you where 53 port");
function execute(interaction) {
    return __awaiter(this, void 0, void 0, function* () {
        let who = "port is free!";
        try {
            // const port = await axios("https://mhp.inboost.ai:5053/api/who");
            const response = yield axios_1.default.get("http://localhost:5050/api/who", {
                headers: {
                    Authorization: `bearer ${config_json_1.bearerToken}`,
                },
            });
            who = response.data;
        }
        catch (err) {
            console.log(err);
        }
        yield interaction.reply(who);
    });
}
exports.execute = execute;
