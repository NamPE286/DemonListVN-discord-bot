import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { version } from '../../package.json';

export const data = new SlashCommandBuilder()
	.setName('ping')
	.setDescription('Lấy thông số của bot');

export async function execute(interaction: ChatInputCommandInteraction) {
	await interaction.reply('Pong!');

	const sent = await interaction.fetchReply();
	const latency = sent.createdTimestamp - interaction.createdTimestamp;

	await interaction.editReply(`
        Pong! 🏓\nLatency: ${latency}ms\nAPI Latency: ${Math.round(interaction.client.ws.ping)}ms\nVersion: ${version}`
	);
}
