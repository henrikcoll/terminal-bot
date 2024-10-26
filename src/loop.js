import {
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
} from "discord.js";
import { ctrlChannelId, discordGuildId } from "./config.js";
import YAML from "yaml";
import fs from "node:fs/promises";
import { getServerResources, listServers } from "./pelican.js";

let data = { lastState: {} };

async function loadData() {
  try {
    data.servers =
      YAML.parse(await fs.readFile("data/servers.yml", "utf8")) || [];
  } catch (e) {
    data.servers = {};
  }
}

async function saveData() {
  try {
    await fs.stat("data");
  } catch (e) {
    await fs.mkdir("data");
  }
  await fs.writeFile("data/servers.yml", YAML.stringify(data.servers), "utf8");
}

const statusMap = {
  running: "Online",
  offline: "Offline",
  starting: "Starting",
  stopping: "Stopping", // TODO: find out if stopping is correct, this is just a guess.
};

async function createMessage(server, resources) {
  const stopButton = new ButtonBuilder()
    .setLabel("Stop")
    .setCustomId(`stop-server#${server.identifier}`)
    .setStyle(ButtonStyle.Danger);

  const restartButton = new ButtonBuilder()
    .setLabel("Restart")
    .setCustomId(`restart-server#${server.identifier}`)
    .setStyle(ButtonStyle.Danger);

  const killButton = new ButtonBuilder()
    .setLabel("Kill")
    .setCustomId(`kill-server#${server.identifier}`)
    .setStyle(ButtonStyle.Danger);

  const startButton = new ButtonBuilder()
    .setLabel("start")
    .setCustomId(`start-server#${server.identifier}`)
    .setStyle(ButtonStyle.Success);

  const row = new ActionRowBuilder();

  if (resources.current_state === "offline") {
    row.addComponents(startButton);
  } else if (
    resources.current_state === "running" ||
    resources.current_state === "starting"
  ) {
    row.addComponents(stopButton, restartButton);
  } else {
    row.addComponents(killButton);
  }

  const content = `# ${server.name}\nStatus: ${statusMap[resources.current_state]}\n${server.description}`;

  return { content, components: [row] };
}

async function updateMessages(channel) {
  const servers = await listServers();
  let persistentChanges = false;
  for (let server of servers) {
    if (!data.servers[server.identifier]) {
      data.servers[server.identifier] = {};

      const resources = await getServerResources(server.identifier);
      data.lastState[server.identifier] = resources.current_state;

      const message = await channel.send(
        await createMessage(server, resources),
      );

      data.servers[server.identifier].messageId = message.id;
      persistentChanges = true;
    } else {
      const message = await channel.messages.fetch(
        data.servers[server.identifier].messageId,
      );
      const resources = await getServerResources(server.identifier);
      if (resources.current_state !== data.lastState[server.identifier]) {
        data.lastState[server.identifier] = resources.current_state;
        await message.edit(await createMessage(server, resources));
      }
    }
  }

  if (persistentChanges) await saveData();
}

/**
 *
 * @param {import('discord.js/typings').Client} client
 */
export async function run(client) {
  await loadData();
  const guild = await client.guilds.fetch(discordGuildId);
  const channel = await guild.channels.fetch(ctrlChannelId);

  await updateMessages(channel);

  setInterval(() => {
    updateMessages(channel);
  }, 5000);
}
