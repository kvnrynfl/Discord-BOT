const { SlashCommandBuilder, PermissionFlagsBits, ModalBuilder, TextInputBuilder, ActionRowBuilder, TextInputStyle, EmbedBuilder } = require('discord.js');
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
        const subcmd = interaction.options.getSubcommand([ "bug", "player" ]);
        var color = randomColor();
        let NewEmbed = new EmbedBuilder();

        switch (subcmd) {
            case "bug":
                const ARBReportBug1 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('InputGeneralReportBug1')
                        .setLabel("Full Name")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder('Please enter your full name.')
                        .setRequired(true)
                );
                const ARBReportBug2 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('InputGeneralReportBug2')
                        .setLabel("Title")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Please enter a brief title for the bug report.")
                        .setRequired(true)
                );
                const ARBReportBug3 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId('InputGeneralReportBug3')
                        .setLabel("Screenshot URL")
                        .setStyle(TextInputStyle.Short)
                        .setPlaceholder("Please enter the URL of a screenshot (if applicable).")
                        .setRequired(true)
                );
                const ARBReportBug4 = new ActionRowBuilder().addComponents(
                    new TextInputBuilder()
                        .setCustomId("InputGeneralReportBug4")
                        .setLabel("Description")
                        .setStyle(TextInputStyle.Paragraph)
                        .setPlaceholder("Please describe the bug in detail, including the steps to reproduce it.")
                        .setRequired(true)
                );

                const reportBug = new ModalBuilder()
                    .setCustomId('GeneralReportBug')
                    .setTitle('Bug Report Submission Form')
                    .addComponents(ARBReportBug1, ARBReportBug2, ARBReportBug3, ARBReportBug4);
                interaction.showModal(reportBug);
                break;
            default:
                NewEmbed
                    .setColor(color)
                    .setDescription(`**❌ | Invalid sub-command. Please try again.**`)
                interaction.reply({ embeds: [ NewEmbed ] });
                break;
        }
    },
};