import {
  Client,
  GatewayIntentBits,
  Collection,
  REST,
  Routes,
} from "discord.js";
import { discordClientId, discordGuildId, discordToken } from "./config.js";
import { join } from "node:path";
import { readdirSync } from "node:fs";

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates],
});

client.commands = new Collection();
client.buttons = new Collection();
client.login(discordToken);

/*
// Removed the commands, but may add some.
const commandsPath = join(import.meta.dirname, "commands");
const commandFiles = readdirSync(commandsPath).filter((file) =>
  file.endsWith(".js"),
);
for (const file of commandFiles) {
  const filePath = join(commandsPath, file);
  const command = await import(filePath);
  // Set a new item in the Collection with the key as the command name and the value as the exported module
  if ("data" in command && "execute" in command) {
    client.commands.set(command.data.name, command);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}
*/

const buttonsPath = join(import.meta.dirname, "buttons");
const buttonFiles = readdirSync(buttonsPath).filter((file) =>
  file.endsWith(".js"),
);
for (const file of buttonFiles) {
  const filePath = join(buttonsPath, file);
  const button = await import(filePath);
  // Set a new item in the Collection with the key as the button name and the value as the exported module
  if ("data" in button && "execute" in button) {
    client.buttons.set(button.data.id, button);
  } else {
    console.log(
      `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`,
    );
  }
}

const eventsPath = join(import.meta.dirname, "events");
const eventFiles = readdirSync(eventsPath).filter((file) =>
  file.endsWith(".js"),
);

for (const file of eventFiles) {
  const filePath = join(eventsPath, file);
  const event = await import(filePath);
  if (event.once) {
    client.once(event.name, (...args) => event.execute(...args));
  } else {
    client.on(event.name, (...args) => event.execute(...args));
  }
}

const rest = new REST().setToken(discordToken);

// and deploy your commands!
(async () => {
  try {
    console.log(
      `Started refreshing ${client.commands.length} application (/) commands.`,
    );

    console.log(client.commands.map((e) => e.data.toJSON()));

    // The put method is used to fully refresh all commands in the guild with the current set
    const data = await rest.put(
      Routes.applicationGuildCommands(discordClientId, discordGuildId),
      { body: client.commands.map((e) => e.data.toJSON()) },
    );

    console.log(
      `Successfully reloaded ${data.length} application (/) commands.`,
    );
  } catch (error) {
    // And of course, make sure you catch and log any errors!
    console.error(error);
  }
})();
