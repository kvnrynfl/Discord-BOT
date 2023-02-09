const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('unban')
		.setDescription('🤖 | Unban a user from this server')
		.addIntegerOption(option => option
            .setName('userId')
            .setDescription('🤖 | Provide the user ID to be unbanned')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('🤖 | The reason for unbanning the user')
            .setRequired(true)
        )
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
	async execute(interaction) {
		const opUnbanTarget = interaction.options.getInteger('userId');
		const opUnbanReason = interaction.options.getString('reason');
		var color = randomColor();
        let NewEmbed = new EmbedBuilder();

		const bannedUsers = await interaction.message.guild.fetchBans();
		if (!bannedUsers.has(opUnbanTarget)) {
			NewEmbed
				.setColor(color)
				.setTitle('Error')
				.setDescription(`User with ID ${opUnbanTarget} is not banned.`);

			interaction.reply({ embeds : [NewEmbed] });
			return;
		}

		await interaction.message.guild.members.unban(opUnbanTarget, opUnbanReason);

		NewEmbed
			.setColor(color)
			.setTitle('Success')
			.setDescription(`User with ID ${opUnbanTarget} has been unbanned. Reason: ${opUnbanReason}`);

		interaction.reply({ embeds : [NewEmbed] });
	},
};