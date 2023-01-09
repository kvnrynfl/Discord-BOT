const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('nowplaying')
		.setDescription('🎵 | Displays the music being played'),
    async execute(interaction) {
        var color = randomColor();
        let QueueEmbed = new EmbedBuilder();

        const getQueue = interaction.client.player.getQueue(interaction.guildId);

        if (!getQueue || !getQueue.playing){
            QueueEmbed
                .setColor(color)
                .setDescription(`**❌ | There are no music being played**`)
            return interaction.editReply({ embeds : [QueueEmbed] });
        }

        const nowPlaying = getQueue.current;

        QueueEmbed
            .setColor(color)
            .setTitle(`**🎶 Music being played**`)
            .setDescription(
                `Author : ${nowPlaying.author}\n` +
                `Title : [${nowPlaying.title}](${nowPlaying.url})\n` +
                `Duration : ${nowPlaying.duration}\n` +
                `Views : ${nowPlaying.views}\n` +
                `Request By : <@${nowPlaying.requestedBy.id}>`
            )
            .setThumbnail(nowPlaying.thumbnail)
            .addFields(
                { name: "Progress Bar", value: `${getQueue.createProgressBar({ timecodes: true , queue : true,})}` }
            )
        interaction.editReply({ embeds : [QueueEmbed] });
    },
};