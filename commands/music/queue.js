const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const { QueryType } = require("discord-player");
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('queue')
		.setDescription('🎵 | Displays the music queue')
        .addStringOption((option) => option
            .setName('page')
            .setDescription('Enter the name/url/playlist you want to play.')
            .setRequired(true)
        ),
    async execute(interaction) {
        const opPlayTrack = interaction.options.getString('track');
        var color = randomColor();
        let QueueEmbed = new EmbedBuilder();
        
        await interaction.editReply({ embeds : [QueueEmbed] });
    },
};