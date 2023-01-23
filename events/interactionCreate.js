const { Events } = require('discord.js');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}
	
			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
				await interaction.editReply({
					content: "❌ | An error occurred, please report it using ``/report bug`` so that it can be fixed immediately",
					ephemeral: true,
				});
			}
		} else if (interaction.isModalSubmit()) {
			await interaction.reply({ content: 'Your submission was received successfully!' });

			const textinput1 = interaction.fields.getTextInputValue('textinput1');
			const textinput2 = interaction.fields.getTextInputValue('textinput2');
			console.log({ textinput1, textinput2 });
		}

		
	},
};