const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('kick')
		.setDescription('🤖 | Kick a user from the server')
		.addUserOption(option => option
			.setName('target')
			.setDescription('🤖 | Tag the user to be kicked')
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName('reason')
			.setDescription('🤖 | The reason for kicking the user')
			.setRequired(true)
		)
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
		.setDMPermission(false),
	async execute(interaction) {
		const opKickTarget = interaction.options.getUser('target');
		const opKickReason = interaction.options.getString('reason');
		var color = randomColor();
		let NewEmbed = new EmbedBuilder();

		if (!opKickTarget) {
			NewEmbed
				.setColor(color)
				.setTitle('💥 | Invalid Command')
				.setDescription('Please provide a user to kick');
			interaction.reply({ embeds: [NewEmbed] });
			return;
		}

		if (!opKickReason) {
			NewEmbed
				.setColor(color)
				.setTitle('💥 | Invalid Command')
				.setDescription('Please provide a reason for kicking the user');
			interaction.reply({ embeds: [NewEmbed] });
			return;
		}

		try {
			await opKickTarget.send(`You have been kicked from the server **${interaction.message.guild.name}** for the reason: ${opKickReason}`);
			await opKickTarget.kick(opKickReason);

			NewEmbed
				.setColor(color)
				.setTitle(`🤖 | ${opKickTarget.username} has been kicked`)
				.setDescription(`Reason: ${opKickReason}`);
			interaction.reply({ embeds: [NewEmbed] });
		} catch (error) {
			NewEmbed
				.setColor(color)
				.setTitle('💥 | Error')
				.setDescription(`An error occurred while trying to kick the user: ${error}`);
			interaction.reply({ embeds: [NewEmbed] });
		}
	},
};
