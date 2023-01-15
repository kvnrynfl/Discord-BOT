const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('leave')
		.setDescription('🎵 | Leave voice channel'),
    async execute(interaction) {
        var color = randomColor();
        let LeaveEmbed = new EmbedBuilder();

        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!getQueue) {
            LeaveEmbed
                .setColor(color)
                .setDescription(`**❌ | Error, to fix it you can enter the ``/join`` command first, then enter the ``/leave`` command**`)
            return interaction.editReply({ embeds : [LeaveEmbed] });
        }

        if (!interaction.member.voice.channel) {
            JoinEmbed
                .setColor(color)
                .setDescription(`**❌ | You must in a voice channel to use this command**`)
            return interaction.editReply({ embeds : [JoinEmbed] });
        }   

        if (!interaction.guild.members.me.voice.channel) {
            JoinEmbed
                .setColor(color)
                .setDescription(`**❌ | Bot is not on the voice channel**`)
            return interaction.editReply({ embeds : [JoinEmbed] });
        }   
        
        if (interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            LeaveEmbed
                .setColor(color)
                .setDescription(`**❌ | You must be on the same voice channel to use this command**`)
			return interaction.editReply({ embeds : [LeaveEmbed] });
		}

        getQueue.destroy();
        
        LeaveEmbed
            .setColor(color)
            .setDescription(`**⏭ | Successfully to leave voice channel**`)
        interaction.editReply({ embeds : [LeaveEmbed] });
    },
};