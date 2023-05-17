const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { ErrorEmbed } = require('../../models/messageEmbed');
const randomColor = require('randomcolor');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('poll')
        .setDescription('Manage polls')
        .addChannelOption((channel) => channel
            .setName('channel')
            .setDescription('tag the channel to poll')
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName('description')
            .setDescription('test')
            .setRequired(true)
        )
        .addStringOption((option) => option
            .setName('title')
            .setDescription('test')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.Connect)
        .setDMPermission(false),
    async execute(interaction) {
        const opChannel = interaction.options.getChannel('channel');
        const opTitle = interaction.options.getString('title');
        const opDescription = interaction.options.getString('description');
        let NewEmbed = new EmbedBuilder();
        var color = randomColor();

        if (!opChannel) {
            NewEmbed
                .setColor(color)
                .setDescription('You need to tag a channel to poll')
            return interaction.reply({ embeds: [ NewEmbed ], ephemeral: true });
        }

        NewEmbed
            .setColor(color)
            .setDescription(opDescription)

        if (opTitle) {
            NewEmbed.setTitle(opTitle)
        }

        try {
            var SendMessages = await opChannel.send({ embeds: [ NewEmbed ] });
            await SendMessages.react('👍');
            await SendMessages.react('👎');
        } catch (error) {
            console.log(error);
            return interaction.reply({ embeds: [ ErrorEmbed ], ephemeral: true });
        }
    },
};        
