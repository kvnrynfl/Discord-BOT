const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		if (!interaction.isChatInputCommand()) return;

		const command = interaction.client.commands.get(interaction.commandName);

		if (!command) {
			console.error(`No command matching ${interaction.commandName} was found.`);
			return;
		}

		try {
			await interaction.deferReply();
			await command.execute(interaction);
		} catch (error) {
			console.error(`Error executing ${interaction.commandName}`);
			console.error(error);
			await interaction.editReply({
                content: "❌ | An error occurred, please report it using ``/report bug`` so that it can be fixed immediately",
                ephemeral: true,
            });
		}
	},
};