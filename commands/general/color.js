const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('color')
		.setDescription('Random Color'),
	async execute(interaction) {
        
        var color = randomColor();
        let ColorEmbed = new EmbedBuilder()
        ColorEmbed
            .setColor(color)
            .setDescription(`Random Color, Code **${color}**`)
        interaction.editReply({ embeds : [ColorEmbed] })
	},
};