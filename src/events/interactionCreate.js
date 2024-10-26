import { Events } from "discord.js";

export const name = Events.InteractionCreate;
/**
 *
 * @param {import ('discord.js').Interaction} interaction
 */
export async function execute(interaction) {
  if (interaction.isChatInputCommand()) return executeCommand(interaction);
  if (interaction.isButton()) return executeButton(interaction);
}

async function executeCommand(interaction) {
  const command = interaction.client.commands.get(interaction.commandName);

  if (!command) {
    console.error(`No command matching ${interaction.commandName} was found.`);
    return;
  }

  try {
    await command.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
}

/**
 *
 * @param {import('discord.js').ButtonInteraction} interaction
 */
async function executeButton(interaction) {
  console.log(interaction.customId);
  const [id] = interaction.customId.split("#");
  const button = interaction.client.buttons.get(id);

  if (!button) {
    console.error(`No button matching ${id} was found.`);
    return;
  }

  try {
    await button.execute(interaction);
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.followUp({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    } else {
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  }
}
