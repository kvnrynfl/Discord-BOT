const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle} = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('Report bugs, players and more')
        .addSubcommand((subcommand) => subcommand
            .setName('bug')
            .setDescription('Report bugs about bots')
        )
        .addSubcommand((subcommand) => subcommand
            .setName('player')
            .setDescription('Report a player who commits a violation')
        ),
	async execute(interaction) {

        const reportBug = new ModalBuilder()
            .setCustomId('reportBug')
            .setTitle('Report Bug About REY-BOT');

        const TIBreportBug1 = new TextInputBuilder()
            .setCustomId('whatHappened')
            .setLabel("What has happened ?")
            .setStyle(TextInputStyle.Short);

        const TIBreportBug2 = new TextInputBuilder()
            .setCustomId('textinput2')
            .setLabel("What's some of your favorite hobbies?")
            .setStyle(TextInputStyle.Paragraph);

        const firstActionRow = new ActionRowBuilder().addComponents(TIBreportBug1);
        const secondActionRow = new ActionRowBuilder().addComponents(TIBreportBug2);

        reportBug.addComponents(firstActionRow, secondActionRow);

        await interaction.showModal(reportBug);
	},
};