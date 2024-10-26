import dotenv from "dotenv";
dotenv.config();

export const discordToken = process.env.DISCORD_TOKEN;
export const discordClientId = process.env.DISCORD_CLIENT_ID;
export const discordGuildId = process.env.DISCORD_GUILD_ID;

export const ctrlChannelId = process.env.CTRL_CHANNEL_ID;

export const pelicanApiKey = process.env.PELICAN_API_KEY;
export const pelicanUrl = process.env.PELICAN_URL;
