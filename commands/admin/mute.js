const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('mute')
		.setDescription('🤖 | Mute a user in the server')
		.addUserOption(option => option
            .setName('target')
            .setDescription('🤖 | Tag the user to be muted')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('🤖 | The reason for muting the user')
            .setRequired(true)
        )
		.addNumberOption(option => option
            .setName('duration')
            .setDescription('🤖 | The duration of the mute in minutes')
            .setRequired(true)
        )
		.setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
	async execute(interaction) {
		const opMuteTarget = interaction.options.getUser('target');
		const opMuteReason = interaction.options.getString('reason');
		const opMuteDuration = interaction.options.getNumber('duration') * 60 * 1000;
		var color = randomColor();
        let NewEmbed = new EmbedBuilder();
		
		if (opMuteTarget) {
			try {
				await opMuteTarget.timeout(opMuteDuration, opMuteReason);
				NewEmbed.setColor(color)
					.setTitle('User Muted')
					.setDescription(`${opMuteTarget.username} has been successfully muted for ${opMuteDuration / 60 / 1000} minutes. Reason: ${opMuteReason}`);
				interaction.reply({ embeds : [NewEmbed] });
			} catch (error) {
				console.error(error);
				NewEmbed.setColor('#ff0000')
					.setTitle('Error')
					.setDescription(`Failed to mute user: ${error}`);
				interaction.reply({ embeds : [NewEmbed] });
			}
		} else {
			NewEmbed.setColor('#ff0000')
				.setTitle('Error')
				.setDescription('Failed to mute user: Invalid target user');
			interaction.reply({ embeds : [NewEmbed] });
		}
	},
};