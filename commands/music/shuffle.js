const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('shuffle')
		.setDescription('🎵 | Shuffle the music queue'),
    async execute(interaction) {
        var color = randomColor();
        let ShuffleEmbed = new EmbedBuilder();

        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!getQueue || !getQueue.playing){
            ShuffleEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.editReply({ embeds : [ShuffleEmbed] });
        }

        const countQueue = getQueue.tracks.length ? getQueue.tracks.length : 0;

        if (countQueue < 1) {
            ShuffleEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music in the queue**`)
            return interaction.editReply({ embeds : [ShuffleEmbed] });
        } else if (countQueue == 1) {
            ShuffleEmbed
                .setColor(color)
                .setDescription(`**❌ | There are only 1 music in the queue**`)
            return interaction.editReply({ embeds : [ShuffleEmbed] });
        } else {
            getQueue.shuffle();

            ShuffleEmbed
                .setColor(color)
                .setDescription(`**🔀 | Successfully shuffle the music queue**`)
            return interaction.editReply({ embeds : [ShuffleEmbed] });
        }        
    },
};