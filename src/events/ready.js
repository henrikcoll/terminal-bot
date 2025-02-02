import { Events } from "discord.js";
import { run } from "../loop.js";

export const name = Events.ClientReady;
export const once = true;
export async function execute(client) {
  console.log(`Ready! Logged in as ${client.user.tag}`);
  run(client);
}
