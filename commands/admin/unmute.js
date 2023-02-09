const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('unmute')
        .setDescription('🤖 | Unmute a user in the server')
        .addUserOption(option => option
            .setName('target')
            .setDescription('🤖 | Tag the user to be unmuted')
            .setRequired(true)
        )
        .addStringOption(option => option
            .setName('reason')
            .setDescription('🤖 | The reason for unmuting the user')
            .setRequired(true)
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Administrator)
        .setDMPermission(false),
    async execute(interaction) {
        const opUnmuteTarget = interaction.options.getUser('target');
        const opUnmuteReason = interaction.options.getString('reason');
        var color = randomColor();
        let NewEmbed = new EmbedBuilder();
        
        if (opUnmuteTarget) {
            try {
                await opUnmuteTarget.removeTimeout();
                NewEmbed.setColor(color)
                    .setTitle('User Unmuted')
                    .setDescription(`${opUnmuteTarget.username} has been successfully unmuted. Reason: ${opUnmuteReason}`);
                interaction.reply({ embeds : [NewEmbed] });
            } catch (error) {
                console.error(error);
                NewEmbed.setColor('#ff0000')
                    .setTitle('Error')
                    .setDescription(`Failed to unmute user: ${error}`);
                interaction.reply({ embeds : [NewEmbed] });
            }
        } else {
            NewEmbed.setColor('#ff0000')
                .setTitle('Error')
                .setDescription('Failed to unmute user: Invalid target user');
            interaction.reply({ embeds : [NewEmbed] });
        }
    },
};