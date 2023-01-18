const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { randomColor } = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('remove')
		.setDescription('🎵 | Delete the music that is in the queue')
        .addNumberOption((option) => option
            .setName('number')
            .setDescription(`Enter the number of queues | if you don't know, you can use /queue`)
            .setMinValue(1)
            .setRequired(true)
        ),

    async execute(interaction) {
        const removenumber = interaction.option.getNumber('number');
        var color = randomColor();
        let RemoveEmbed = new EmbedBuilder();
        
        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            RemoveEmbed
                .setColor(color)
                .setDescription(`**❌ | You must in a voice channel to use this command**`)
            return interaction.editReply({ embeds : [RemoveEmbed] });
        }

        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            RemoveEmbed
                .setColor(color)
                .setDescription(`**❌ | You must be on the same voice channel to use this command**`)
			return interaction.editReply({ embeds : [RemoveEmbed] });
		}

        if (!getQueue || !getQueue.playing){
            RemoveEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.editReply({ embeds : [RemoveEmbed] });
        }

        const countQueue = getQueue.tracks.length ? getQueue.tracks.length : 0;

        if (countQueue < 1) {
            RemoveEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music in the queue**`)
            return interaction.editReply({ embeds : [RemoveEmbed] });
        }

        if (removenumber) {
            if (removenumber > countQueue) {
                RemoveEmbed
                    .setColor(color)
                    .setDescription(`**❌ | Invalid Number. There are only a total of ${countQueue} queue**`)
                return interaction.editReply({ embeds : [RemoveEmbed] });
            }

            getQueue.remove(removenumber - 1);

            RemoveEmbed
                .setColor(color)
                .setDescription(`**⏭ | Successfully skip music to queue number ${removenumber}**`)
        }

        interaction.editReply({ embeds : [RemoveEmbed] });
    },
};