const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder} = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('report')
		.setDescription('🤖 | Report bugs, players and more')
        .addSubcommand((subcommand) => subcommand
            .setName('bug')
            .setDescription('🤖 | Report bugs about bots')
        )
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
	async execute(interaction) {
        const subcmd = interaction.options.getSubcommand(["bug", "player"]);
        var color = randomColor();
        let NewEmbed = new EmbedBuilder();


        switch (subcmd) {
            case "bug":
                const ARBReportBug1 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('InputGeneralReportBug1')
                        .setLabel("Full Name")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Please input your full name.')
                );
                const ARBReportBug2 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('InputGeneralReportBug2')
                        .setLabel("What Happened")
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder("Please explain about the bug that occurred.")
                        .setValue("Title : \nScreenshot URL : \nDescription : ")
                );
                const reportBug = new ModalBuilder()
                    .setCustomId('GeneralReportBug')
                    .setTitle('Bug Report Submission Form')
                    .addComponents(ARBReportBug1, ARBReportBug2);
                interaction.showModal(reportBug);
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