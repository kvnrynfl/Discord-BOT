const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomColor } = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('resume')
		.setDescription('🎵 | Resume the currently paused song'),
    async execute(interaction) {
        var color = randomColor();
        let ResumeEmbed = new EmbedBuilder();
        
        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            ResumeEmbed
                .setColor(color)
                .setDescription(`**❌ | You must in a voice channel to use this command**`)
            return interaction.editReply({ embeds : [ResumeEmbed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            ResumeEmbed
                .setColor(color)
                .setDescription(`**❌ | You must be on the same voice channel to use this command**`)
			return interaction.editReply({ embeds : [ResumeEmbed] });
		}

        if (!getQueue || !getQueue.playing){
            ResumeEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.editReply({ embeds : [ResumeEmbed] });
        }

        getQueue.setPaused(false);
        ResumeEmbed
            .setColor(color)
            .setDescription(`**▶️ | Music successfully resume**`)
        interaction.editReply({ embeds : [ResumeEmbed] });
    },
};