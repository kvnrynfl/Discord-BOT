const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('🎵 | Shuffle the music queue'),
    async execute(interaction) {
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
            return interaction.editReply({ embeds : [NewEmbed], ephemeral : true });
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
        } else if (countQueue == 1) {
            NewEmbed
                .setColor(color)
                .setDescription(`**❌ | There are only 1 music in the queue**`)
            return interaction.editReply({ embeds : [NewEmbed], ephemeral : true });
        } else {
            getQueue.shuffle();

            NewEmbed
                .setColor(color)
                .setDescription(`**🔀 | Successfully shuffle the music queue**`)
            return interaction.editReply({ embeds : [NewEmbed] });
        }        
    },
};