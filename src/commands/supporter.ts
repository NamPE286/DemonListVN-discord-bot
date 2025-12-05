import { ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { getPlayer } from '../services/player.service';
import { isActive } from '../utils/isActive';

export const data = new SlashCommandBuilder()
	.setName('supporter')
	.setDescription('Kiểm tra trạng thái supporter của người chơi')
	.addUserOption((option) =>
		option.setName('user').setDescription('Người dùng muốn kiểm tra').setRequired(false)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	const targetUser = interaction.options.getUser('user') ?? interaction.user;
	const discordId = targetUser.id;

	try {
		await interaction.deferReply();

		const player = await getPlayer(discordId);

		if (!player) {
			await interaction.editReply(`Không tìm thấy tài khoản liên kết với ${targetUser.username}`);
			return;
		}

		const isSupporter = isActive(player.supporterUntil);

		const embed = new EmbedBuilder()
			.setTitle(`Trạng thái Supporter của ${player.name}`)
			.setColor(isSupporter ? 0xffd700 : 0x808080)
			.addFields({
				name: 'Trạng thái',
				value: isSupporter ? '✅ Đang hoạt động' : '❌ Không hoạt động',
				inline: true
			})
			.addFields({
				name: 'Gia hạn',
				value: '[Bấm vào đây để gia hạn](https://www.demonlistvn.com/supporter)'
			});

		if (isSupporter && player.supporterUntil) {
			const expiryDate = new Date(player.supporterUntil);
			embed.addFields({
				name: 'Hết hạn',
				value: expiryDate.toLocaleDateString('vi-VN'),
				inline: true
			});

			const daysRemaining = Math.ceil(
				(expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
			);
			embed.addFields({
				name: 'Còn lại',
				value: `${daysRemaining} ngày`,
				inline: true
			});
		}

		await interaction.editReply({ embeds: [embed] });
	} catch (error) {
		console.error('Error checking supporter status:', error);
		await interaction.editReply('Có lỗi xảy ra');
	}
}
