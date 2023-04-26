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
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
const config_json_1 = require("./config.json");
const commandModules = __importStar(require("./commands"));
const v9_1 = require("discord-api-types/v9");
const commands = [];
for (const module of Object.values(commandModules)) {
    commands.push(module.data);
}
// Construct and prepare an instance of the REST module
const rest = new discord_js_1.REST({ version: "9" }).setToken(config_json_1.token);
config_json_1.guildId.forEach(guild => {
    rest.put(v9_1.Routes.applicationGuildCommands(config_json_1.clientId, guild), {
        body: commands,
    }).then((data) => {
        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    });
});
// and deploy your commands!
// try {
//     console.log(`Started refreshing ${commands.length} application (/) commands.`);
//     // The put method is used to fully refresh all commands in the guild with the current set
//     rest.put(Routes.applicationGuildCommands(clientId, guildId), {
//         body: commands,
//     }).then((data: string) => {
//         console.log(`Successfully reloaded ${data.length} application (/) commands.`);
//     });
// } catch (error) {
//     // And of course, make sure you catch and log any errors!
//     console.error(error);
// }
