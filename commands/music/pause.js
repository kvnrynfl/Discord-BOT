const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomColor } = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('pause')
		.setDescription('🎵 | Pause the music being played'),
    async execute(interaction) {
        var color = randomColor();
        let PauseEmbed = new EmbedBuilder();
        
        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            PauseEmbed
                .setColor(color)
                .setDescription(`**❌ | You must in a voice channel to use this command**`)
            return interaction.editReply({ embeds : [PauseEmbed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            PauseEmbed
                .setColor(color)
                .setDescription(`**❌ | You must be on the same voice channel to use this command**`)
			return interaction.editReply({ embeds : [PauseEmbed] });
		}

        if (!getQueue || !getQueue.playing){
            PauseEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.editReply({ embeds : [PauseEmbed] });
        }

        getQueue.setPaused(true);
        PauseEmbed
            .setColor(color)
            .setDescription(`**⏸ | Music successfully paused**`)
        interaction.editReply({ embeds : [PauseEmbed] });
    },
};