import { Client, GatewayIntentBits, Collection, Events, ActivityType } from 'discord.js';
import { loadCommands, Command } from './utils/command-loader.js';

const client = new Client({
	intents: [GatewayIntentBits.Guilds]
}) as Client & { commands: Collection<string, Command> };

client.commands = new Collection();

client.on(Events.ClientReady, async () => {
	console.log(`Logged in as ${client.user?.tag}`);

	client.user?.setPresence({
		activities: [
			{
				name: 'Geometry Dash | /help',
				type: ActivityType.Playing
			}
		],
		status: 'online'
	});

	client.commands = await loadCommands();
});

client.on(Events.InteractionCreate, async (interaction) => {
	if (!interaction.isChatInputCommand()) return;

	const command = client.commands.get(interaction.commandName);

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
				content: 'Có lỗi xảy ra',
				ephemeral: true
			});
		} else {
			await interaction.reply({
				content: 'Có lỗi xảy ra',
				ephemeral: true
			});
		}
	}
});

client.login(process.env.DISCORD_TOKEN);
