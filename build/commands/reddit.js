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
exports.data = new discord_js_1.SlashCommandBuilder()
    .setName("reddit")
    .setDescription("Get picture from reddit API")
    .addStringOption(option => option
    .setName("subreddit")
    .setDescription("name community where i can find some cool pictures")
    .setRequired(false))
    .addNumberOption(option => option.setName("limit").setDescription("how many posts from reddit get?").setRequired(false));
function execute(interaction) {
    var _a, _b, _c, _d, _e;
    return __awaiter(this, void 0, void 0, function* () {
        const subredditName = (_b = (_a = interaction.options.data.find(option => option.name === "subreddit")) === null || _a === void 0 ? void 0 : _a.value) !== null && _b !== void 0 ? _b : "ProgrammerHumor";
        const limit = Number((_d = (_c = interaction.options.data.find(option => option.name === "limit")) === null || _c === void 0 ? void 0 : _c.value) !== null && _d !== void 0 ? _d : 10);
        yield interaction.deferReply();
        try {
            // Fetch the list of posts from the subreddit
            const response = yield axios_1.default.get(`https://www.reddit.com/r/${subredditName}/new.json?limit=${limit}`);
            const arr = response.data.data.children;
            const randomIndex = Math.floor(Math.random() * arr.length);
            const randomElement = arr.splice(randomIndex, 1)[0];
            yield interaction.editReply((_e = randomElement === null || randomElement === void 0 ? void 0 : randomElement.data) === null || _e === void 0 ? void 0 : _e.url);
        }
        catch (err) {
            console.error(err);
            yield interaction.editReply(err);
        }
    });
}
exports.execute = execute;
