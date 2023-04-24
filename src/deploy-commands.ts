import { REST, SlashCommandBuilder } from "discord.js";
import { clientId, guildId, token } from "./config.json";
import * as commandModules from "./commands";
import { Routes } from "discord-api-types/v9";

type Command = {
    data: SlashCommandBuilder;
};

const commands: Command[] = [];

for (const module of Object.values<any>(commandModules)) {
    commands.push(module.data);
}

// Construct and prepare an instance of the REST module
const rest = new REST({ version: "9" }).setToken(token);
guildId.forEach(guild => {
    rest.put(Routes.applicationGuildCommands(clientId, guild), {
        body: commands,
    }).then((data: string[]) => {
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
