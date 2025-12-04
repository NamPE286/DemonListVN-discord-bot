import { ChatInputCommandInteraction, SlashCommandBuilder } from 'discord.js';
import { getPlayer } from '../services/player.service';

export const data = new SlashCommandBuilder()
    .setName('profile')
    .setDescription("Get user's profile");

export async function execute(interaction: ChatInputCommandInteraction) {
    const discordId = interaction.user.id;
    
    try {
        const player = await getPlayer(discordId);
        
        if (!player) {
            await interaction.reply('No profile found for your Discord account.');
            return;
        }
        
        const profileInfo = [
            `**Name:** ${player.name}`,
            `**Province:** ${player.province}, ${player.city}`,
            `**Classic Rank:** ${player.dlrank ?? 'N/A'}`,
            `**Platformer Rank:** ${player.plrank ?? 'N/A'}`,
            `**FL Rank:** ${player.flrank ?? 'N/A'}`,
            `**Classic Rating:** ${player.rating ?? 0}`,
            `**Platformer Rating:** ${player.plRating ?? 0}`,
            `**Total FL Points:** ${player.totalFLpt ?? 0}`,
            `**Records:** ${player.recordCount}`,
            `**EXP:** ${player.exp}`,
            `**Clan:** ${player.clans?.tag ?? 'None'}`,
        ].join('\n');
        
        await interaction.reply(profileInfo);
    } catch (error) {
        console.error('Error fetching player profile:', error);
        await interaction.reply('Failed to fetch profile. Please try again later.');
    }
}