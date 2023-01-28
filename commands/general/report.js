const { SlashCommandBuilder, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder} = require('discord.js');
const randomColor = require('randomcolor');

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
        const subcmd = interaction.options.getSubcommand(["bug", "player"]);
        var color = randomColor();
        let NewEmbed = new EmbedBuilder();


        switch (subcmd) {
            case "bug":
                const TIBreportBug1 = new TextInputBuilder()
                    .setCustomId('textinput1')
                    .setLabel("What has happened ?")
                    .setStyle(TextInputStyle.Short);

                const TIBreportBug2 = new TextInputBuilder()
                    .setCustomId('textinput2')
                    .setLabel("What's some of your favorite hobbies?")
                    .setStyle(TextInputStyle.Paragraph);

                const firstActionRow = new ActionRowBuilder().addComponents(TIBreportBug1);
                const secondActionRow = new ActionRowBuilder().addComponents(TIBreportBug2);

                const reportBug = new ModalBuilder()
                    .setCustomId('reportBug')
                    .setTitle('Report Bug About REY-BOT')
                    .addComponents(firstActionRow, secondActionRow);

                interaction.showModal(reportBug);
                break;
            case "player":
                
                break;
            default:
                NewEmbed
                    .setColor(color)
                    .setDescription(`**❌ | Unknown sub command.**`)
                interaction.reply({ embeds : [NewEmbed] });
                break;
        }  
	},
};