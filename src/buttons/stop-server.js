import { listServers, sendServerPower } from "../pelican.js";

export const data = {
  id: "stop-server",
};

/**
 *
 * @param {import('discord.js').ButtonInteraction} interaction
 */
export async function execute(interaction) {
  const [_, identifier] = interaction.customId.split("#");

  if (await sendServerPower(identifier, "stop"))
    interaction.reply({ content: "stopping server", ephemeral: true });
}
