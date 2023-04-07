"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
const http_1 = __importDefault(require("http"));
const discord_js_1 = require("discord.js");
const node_fs_1 = __importDefault(require("node:fs"));
const node_path_1 = __importDefault(require("node:path"));
const config_json_1 = require("./config.json");
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const commandModules = __importStar(require("./commands"));
const logger_1 = __importDefault(require("./controllers/logger"));
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, "");
    };
}
const app = (0, express_1.default)();
// adding Helmet to enhance your Rest API's security
app.use((0, helmet_1.default)());
// using bodyParser to parse JSON bodies into JS objects
app.use(body_parser_1.default.json());
// enabling CORS for all requests
app.use((0, cors_1.default)());
// adding morgan to log HTTP requests
app.use((0, morgan_1.default)("combined"));
// settings the routes for api
app.use("/api/v1", logger_1.default);
const bot = () => {
    const client = new discord_js_1.Client({ intents: [discord_js_1.GatewayIntentBits.Guilds] });
    client.on(discord_js_1.Events.InteractionCreate, (interaction) => __awaiter(void 0, void 0, void 0, function* () {
        if (!interaction.isChatInputCommand())
            return;
        const command = commandModules[interaction.commandName];
        if (!command)
            return;
        try {
            yield command.execute(interaction);
        }
        catch (error) {
            console.error(error);
            if (interaction.replied || interaction.deferred) {
                yield interaction.followUp({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
            else {
                yield interaction.reply({
                    content: "There was an error while executing this command!",
                    ephemeral: true,
                });
            }
        }
    }));
    client.login(config_json_1.token);
};
try {
    const options = {
        passphrase: config_json_1.sslPassword,
        pfx: node_fs_1.default.readFileSync(node_path_1.default.join(__dirname, "STAR_inboost_ai.pfx")),
    };
    const httpsServer = https_1.default.createServer(options, app);
    httpsServer.listen(config_json_1.port, bot);
}
catch (_a) {
    const httpServer = http_1.default.createServer(app);
    httpServer.listen(+config_json_1.port - 1000, bot);
}
