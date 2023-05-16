const { EmbedBuilder } = require('discord.js')
const randomColor = require('randomcolor');

const ErrorEmbed = new EmbedBuilder()
    .setColor(randomColor())
    .setDescription("❌ | An error occurred, please report it using ``/report bug`` so that it can be fixed immediately")

module.exports = {
    ErrorEmbed,
};