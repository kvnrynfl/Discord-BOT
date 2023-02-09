const { SlashCommandBuilder, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	data: new SlashCommandBuilder()
		.setName("nick")
		.setDescription("🤖 | Mengganti nickname user")
		.addUserOption(option => option
			.setName("user")
			.setDescription("🤖 | Nama user yang akan di-ganti nickname")
			.setRequired(true)
		)
		.addStringOption(option => option
			.setName("nickname")
			.setDescription("🤖 | Nickname baru untuk user")
			.setRequired(true)
		),
	async execute(interaction) {
		const opNickUser = interaction.options.getUser("user");
		const opNickNickname = interaction.options.getString("nickname");
		var color = randomColor();
		let NewEmbed = new EmbedBuilder();

		// Cari user dengan nama yang sesuai
		let targetUser = interaction.guild.members.cache.find(user => user.displayName === opNickUser);
		if (!targetUser) {
			return interaction.reply("🤖 | User tidak ditemukan.");
		}

		// Ubah nickname user
		try {
			await targetUser.setNickname(opNickNickname);
			interaction.reply(`🤖 | Nickname dari user ${targetUser.displayName} berhasil diubah menjadi "${opNickNickname}"`);
		} catch (error) {
			interaction.reply(`🤖 | Gagal mengubah nickname user. Error: ${error}`);
		}
	},
};
