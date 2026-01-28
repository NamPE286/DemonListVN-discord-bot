import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import { getPlayer } from '../services/player.service';
import { getPlayerSubmissions, getMostRecentSubmission } from '../services/submission.service';

export const data = new SlashCommandBuilder()
	.setName('submission')
	.setDescription('Lấy bản ghi được gửi gần đây nhất')
	.addUserOption((option) =>
		option.setName('user').setDescription('Người dùng để lấy bản ghi').setRequired(false)
	);

export async function execute(interaction: ChatInputCommandInteraction) {
	try {
		await interaction.deferReply();

		const targetUser = interaction.options.getUser('user') ?? interaction.user;
		const player = await getPlayer(targetUser.id);

		if (!player) {
			await interaction.editReply({
				content: `Không tìm thấy tài khoản liên kết với ${targetUser.username}`
			});
			return;
		}

		const submissions = await getPlayerSubmissions(player.uid);

		if (submissions.length === 0) {
			await interaction.editReply({
				content: `${targetUser.username} không có bản ghi được gửi`
			});
			return;
		}

		const mostRecent = getMostRecentSubmission(submissions);

		if (!mostRecent) {
			await interaction.editReply({
				content: `${targetUser.username} không có bản ghi được gửi`
			});
			return;
		}

		const level = mostRecent.levels;
		const date = new Date(mostRecent.timestamp);
		const playerLink = `https://www.demonlistvn.com/player/${player.uid}`;
		const levelLink = `https://www.demonlistvn.com/level/${level.id}`;

		const formatTime = (ms: number) => {
			const minutes = Math.floor(ms / 60000);
			const seconds = Math.floor((ms % 60000) / 1000);
			const milliseconds = ms % 1000;
			return `${minutes}:${seconds.toString().padStart(2, '0')}.${milliseconds
				.toString()
				.padStart(3, '0')}`;
		};

		const embed = new EmbedBuilder()
			.setColor('#0099ff')
			.setTitle(`Bản ghi được gửi gần đây của ${player.name}`)
			.setDescription(`**${level.name}** by ${level.creator}`)
			.setURL(levelLink)
			.addFields(
				{
					name: 'Tiến độ',
					value: `${mostRecent.progress}%`,
					inline: true
				},
				{
					name: 'Điểm DL',
					value: mostRecent.dlPt !== null ? `${mostRecent.dlPt}` : 'N/A',
					inline: true
				},
				{
					name: 'Điểm FL',
					value: mostRecent.flPt !== null ? `${mostRecent.flPt}` : 'N/A',
					inline: true
				},
				{
					name: 'Ngày gửi',
					value: date.toLocaleDateString('vi-VN'),
					inline: true
				},
				{
					name: 'FPS',
					value: `${mostRecent.refreshRate}fps`,
					inline: true
				},
				{
					name: 'Mobile',
					value: mostRecent.mobile ? 'Có' : 'Không',
					inline: true
				}
			);

		if (mostRecent.videoLink) {
			embed.addFields({
				name: 'Video',
				value: `[Xem](${mostRecent.videoLink})`,
				inline: false
			});
		}

		if (mostRecent.comment) {
			embed.addFields({
				name: 'Bình luận',
				value: mostRecent.comment.substring(0, 1024),
				inline: false
			});
		}

		await interaction.editReply({ embeds: [embed] });
	} catch (error) {
		console.error('Submission command error:', error);
		await interaction.editReply('Có lỗi xảy ra');
	}
}
