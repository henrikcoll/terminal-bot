import { sendServerPower } from "../pelican.js";

export const data = {
  id: "start-server",
};

/**
 *
 * @param {import('discord.js').ButtonInteraction} interaction
 */
export async function execute(interaction) {
  const [_, identifier] = interaction.customId.split("#");

  if (await sendServerPower(identifier, "restart"))
    interaction.reply({ content: "restarting server", ephemeral: true });
}
