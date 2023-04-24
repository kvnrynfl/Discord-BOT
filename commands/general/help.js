const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const { table, getBorderCharacters } = require("table");
const randomColor = require('randomcolor');
require('dotenv').config()
const config = require('../../config.json');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('help')
		.setDescription('🤖 | Replies with help embed!')
        .setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(true),
	async execute(interaction) {
        var color = randomColor();
        let NewEmbed = new EmbedBuilder();

        tableConfig = {
            ...config.table.text,
            drawHorizontalLine: () => false
        }

        function listHelpCommands() {
            let commandsInfo = interaction.guild.commands.client.commands.filter(dir => dir.data.name === 'info');
            let commandsReport = interaction.guild.commands.client.commands.filter(dir => dir.data.name === 'report');
            let dataArray = [];

            commandsInfo.forEach((cmd) => {
                cmd.data.options.forEach((grp) => {
                    if (grp.options && grp.options.length) {
                        grp.options.forEach((sub) => {
                            dataArray.push(`> \`/${cmd.data.name} ${grp.name} [${sub.name}]\` = ${grp.description.slice(5)}`);
                        });
                    } else {
                        dataArray.push(`> \`/${cmd.data.name} ${grp.name}\` = ${grp.description.slice(5)}`);
                    }
                });
            });
            commandsReport.forEach((cmd) => {
                cmd.data.options.filter(grp => grp.name !== 'player').forEach((grp) => {
                    if(grp.option && grp.option.length) {
                        grp.options.forEach((sub) => {
                            dataArray.push(`> \`/${cmd.data.name} ${grp.name} [${sub.name}]\` = ${grp.description.slice(5)}`);
                        });
                    } else {
                        dataArray.push(`> \`/${cmd.data.name} ${grp.name}\` = ${grp.description.slice(5)}`);
                    }
                })
            });
            return dataArray;
        }

        NewEmbed
            .setColor(color)
            .addFields(
                { name: 'Helpful links', value: 
                    `> [Invite](https://${process.env.CLIENT_INVITE})\n` +
                    `> [Website](https://${process.env.CLIENT_WEBSITE})\n` +
                    `> [Contribution](https://${process.env.CLIENT_REPOSITORY})\n` +
                    `> [Support Server](https://${process.env.CLIENT_SUPPORT})\n` 
                },
                { name: 'Other Information', value: listHelpCommands().join('\n') },
            )
            // .setFooter(`REY-BOT v${process.env.CLIENT_VERSION}`);
		interaction.reply({ embeds : [NewEmbed] });
	},
};