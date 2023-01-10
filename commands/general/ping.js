const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('ping')
		.setDescription('🤖 | See your ping!'),
	async execute(interaction) {

		// Mengubah warna pesan embed menjadi warna random yang cerah
		const r = Math.floor(Math.random() * 200) + 50;
		const g = Math.floor(Math.random() * 200) + 50;
		const b = Math.floor(Math.random() * 200) + 50;
		const color = `#${r.toString(16)}${g.toString(16)}${b.toString(16)}`;

	 	// Informasi mengenai uptime discord bot
        let totaluptime = (interaction.client.uptime / 1000);
		let updays = Math.floor(totaluptime / 86400);
		let uphours = Math.floor( (totaluptime %= 86400) / 3600);
		let upminutes = Math.floor( (totaluptime%= 3600) / 60);
		let upseconds = Math.floor(totaluptime % 60);

		const msg = await interaction.editReply({content: "⏳ | Calculating ping...", fetchReply:true });
		ping = msg.createdTimestamp - interaction.createdTimestamp;
		disapi = Math.round(interaction.client.ws.ping);

		const pingEmbed = new EmbedBuilder()
            .setColor(color)
            .addFields(
                { name: "Ping", value: `\` ${ping} ms \``, inline: true },
                { name: "Discord API", value: `\` ${disapi} ms \``, inline: true },
                { name: 'Uptime', value: `${updays} days ${uphours} hours ${upminutes} minutes ${upseconds} seconds` },
                { name: "Problem ?", value: "Check discord status : [discordstatus.com](https://discordstatus.com/)" },
            )
			.setTimestamp()
			.setFooter({ text: `${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
        await interaction.editReply({ content: false, embeds: [pingEmbed] });
	},
};