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
        let NewEmbed = new EmbedBuilder();
        
        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!interaction.member.voice.channel) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | You must in a voice channel to use this command**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }

        if (!interaction.guild.members.me.voice.channel) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | Bot is not on the voice channel**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }
        
        if (interaction.guild.members.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | You must be on the same voice channel to use this command**`)
			return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
		}
        
        if (!getQueue || !getQueue.playing){
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }

        const countQueue = getQueue.tracks.length ? getQueue.tracks.length : 0;

        if (countQueue < 1) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music in the queue**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }

        if (removenumber > countQueue) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | Invalid Number. There are only a total of ${countQueue} queue**`)
            return interaction.reply({ embeds : [NewEmbed], ephemeral : true });
        }

        getQueue.remove(removenumber - 1);

        NewEmbed
            .setColor(color)
            .setDescription(`**⏭ | Successfully skip music to queue number ${removenumber}**`)
        interaction.reply({ embeds : [NewEmbed] });
    },
};