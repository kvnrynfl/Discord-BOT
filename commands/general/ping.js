const { SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('🤖 | See your ping!')
		.setDefaultMemberPermissions(PermissionFlagsBits.SendMessages)
        .setDMPermission(false),
	async execute(interaction) {
		let color = randomColor();
		let NewEmbed = new EmbedBuilder();

	 	// Informasi mengenai uptime discord bot
        let totaluptime = (interaction.client.uptime / 1000);
		let updays = Math.floor(totaluptime / 86400);
		let uphours = Math.floor( (totaluptime %= 86400) / 3600);
		let upminutes = Math.floor( (totaluptime%= 3600) / 60);
		let upseconds = Math.floor(totaluptime % 60);

		const msg = await interaction.reply({content: "⏳ | Calculating ping...", fetchReply : true });

		let ping = msg.createdTimestamp - interaction.createdTimestamp;
		let disapi = Math.round(interaction.client.ws.ping);

		NewEmbed
            .setColor(color)
            .addFields(
                { name: "Ping", value: `\` ${ping} ms \``, inline: true },
                { name: "Discord API", value: `\` ${disapi} ms \``, inline: true },
                { name: 'Uptime', value: `${updays} days ${uphours} hours ${upminutes} minutes ${upseconds} seconds` },
                { name: "Problem ?", value: "Check discord status : [discordstatus.com](https://discordstatus.com/)" },
            )
			.setTimestamp()
			.setFooter({ text: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })

        await interaction.editReply({ embeds: [NewEmbed] });
	},
};