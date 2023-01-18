const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('jump')
		.setDescription('🎵 | Jump to another queue')
        .addNumberOption((option) => option
            .setName("number")
            .setDescription("Enter the number of queues | if you don't know, you can use /queue")
            .setMinValue(1)
            .setRequired(true)
        ),
    async execute(interaction) {
        const jumpnumber = interaction.options.getNumber("number");
        var color = randomColor();
        let JumpEmbed = new EmbedBuilder();

        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!getQueue || !getQueue.playing){
            JumpEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.editReply({ embeds : [JumpEmbed] });
        }

        const countQueue = getQueue.tracks.length ? getQueue.tracks.length : 0;

        if (countQueue < 1) {
            JumpEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music in the queue**`)
            return interaction.editReply({ embeds : [JumpEmbed] });
        }

        if (countQueue < jumpnumber) {
            JumpEmbed
                .setColor(color)
                .setDescription(`**❌ | Invalid Number. There are only a total of ${countQueue} queue**`)
            return interaction.editReply({ embeds : [JumpEmbed] });
        } else {
            getQueue.jump(jumpnumber - 1);
            
            JumpEmbed
                .setColor(color)
                .setDescription(`**⏭ | Successfully jump music to queue number ${jumpnumber} **`)
            return interaction.editReply({ embeds : [JumpEmbed] });
        }
    },
};