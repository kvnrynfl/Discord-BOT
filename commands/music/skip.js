const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('skip')
		.setDescription('🎵 | Skip the currently playing song')
        .addNumberOption((option) => option
            .setName('number')
            .setDescription(`Enter the number of queues | if you don't know, you can use /queue`)
            .setMinValue(1)
        ),
    async execute(interaction) {
        const skipnumber = interaction.options.getNumber("number");
        var color = randomColor();
        let SkipEmbed = new EmbedBuilder();


        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!getQueue || !getQueue.playing){
            SkipEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.editReply({ embeds : [SkipEmbed] });
        }

        const countQueue = getQueue.tracks.length ? getQueue.tracks.length : 0;

        if (countQueue < 1) {
            SkipEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music in the queue**`)
            return interaction.editReply({ embeds : [SkipEmbed] });
        }

        if (skipnumber) {
            if (skipnumber > countQueue) {
                SkipEmbed
                    .setColor(color)
                    .setDescription(`**❌ | Invalid Number. There are only a total of ${countQueue} queue**`)
                return interaction.editReply({ embeds : [SkipEmbed] });
            }

            getQueue.skipTo(skipnumber - 1);

            SkipEmbed
                .setColor(color)
                .setDescription(`**⏭ | Successfully skip music to queue number ${skipnumber}**`)
        } else {
            getQueue.skip();
            
            SkipEmbed
                .setColor(color)
                .setDescription(`**⏭ | Successfully to skip music**`)
        }
        
        interaction.editReply({ embeds : [SkipEmbed] });
    },
};