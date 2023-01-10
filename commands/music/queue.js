const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('🎵 | Displays the music queue')
        .addNumberOption((option) => option
            .setName('page')
            .setDescription('Enter the queue page number')
            .setMinValue(1)
        ),
    async execute(interaction) {
        const opQueuePage = (interaction.options.getNumber('page') || 1) - 1;
        var color = randomColor();
        let QueueEmbed = new EmbedBuilder();

        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!getQueue || !getQueue.playing){
            QueueEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.editReply({ embeds : [QueueEmbed] });
        }

        const countQueue = getQueue.tracks.length ? getQueue.tracks.length : 0;

        if (countQueue < 1) {
            QueueEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music in the queue**`)
            return interaction.editReply({ embeds : [QueueEmbed] });
        }

        const totalPages = Math.ceil(countQueue / 10) || 1;

        if (opQueuePage + 1 > totalPages) {
            QueueEmbed
                .setColor(color)
                .setDescription(`**❌ | Invalid Page. There are only a total of ${totalPages} pages of queue**`)
            return interaction.editReply({ embeds : [QueueEmbed] });
        }

        QueueEmbed
            .setColor(color)
            .setTitle(`**🎶 List of music queue to be played**`)
            .setDescription(
                `${getQueue.tracks.slice(opQueuePage * 10, opQueuePage * 10 + 10).map((song, i) => 
                    `**${opQueuePage * 10 + i + 1}.** \`[${song.duration}]\` ${song.title} -- <@${song.requestedBy.id}>`
                ).join("\n")}`
            )
            .setFooter({
                text: `Page ${opQueuePage + 1} of ${totalPages}`,
                iconURL: `${interaction.client.user.displayAvatarURL()}`
            })
        interaction.editReply({ embeds : [QueueEmbed] });
    },
};