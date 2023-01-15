const { SlashCommandBuilder } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Prune up to 99 messages.')
		.addIntegerOption(option => option
			.setName('amount')
			.setDescription('Number of messages to prune')
			.setMinValue(1)
			.setMaxValue(99)
			.setRequired(true)
		),
	async execute(interaction) {
		const amount = interaction.options.getInteger('amount');

		if (amount < 1 || amount > 99) {
			return interaction.editreply({ content: 'You need to input a number between 1 and 99.', ephemeral: true });
		}
		await interaction.channel.bulkDelete(amount, true).catch(error => {
			console.log(error);
			return interaction.editreply({ content: 'There was an error trying to prune messages in this channel!', ephemeral: true });
		});

		return interaction.editReply({ content: `Successfully pruned \`${amount}\` messages.`, ephemeral: true });
	},
};