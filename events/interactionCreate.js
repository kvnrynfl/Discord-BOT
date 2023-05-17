const { Events, EmbedBuilder } = require('discord.js');
const { interactionDataUpdate, inputDataReportBug } = require('../handlers/databaseHandler');
const randomColor = require('randomcolor');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		var color = randomColor();
		let EventsEmbed = new EmbedBuilder();

		if (interaction.isChatInputCommand()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			if (!interaction.guild && interaction.user.id !== '698115537364058143') {
				EventsEmbed
					.setColor(color)
					.setDescription("❌ |  Youcannot use the slash command in direct messages")
				return interaction.reply({ embeds: [ EventsEmbed ], ephemeral: true });
			}

			await interactionDataUpdate(interaction);

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
				EventsEmbed
					.setColor(color)
					.setDescription("❌ | An error occurred, please report it using ``/report bug`` so that it can be fixed immediately")
				return interaction.reply({ embeds: [ EventsEmbed ], ephemeral: true });
			}
		} else if (interaction.isAutocomplete()) {
			const command = interaction.client.commands.get(interaction.commandName);

			if (!command) {
				console.error(`No command matching ${interaction.commandName} was found.`);
				return;
			}

			try {
				await command.autocomplete(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
			}
		} else if (interaction.isModalSubmit()) {
			switch (interaction.customId) {
				case 'GeneralReportBug':
					const inputResult = await inputDataReportBug(
						interaction.guild.id,
						interaction.user.id,
						interaction.fields.getTextInputValue('InputGeneralReportBug1'),
						interaction.fields.getTextInputValue('InputGeneralReportBug2'),
						interaction.fields.getTextInputValue('InputGeneralReportBug3'),
						interaction.fields.getTextInputValue('InputGeneralReportBug4'),
					);
					
					if (inputResult) {
						EventsEmbed
							.setColor(color)
							.setDescription("✅ | Your submission was received successfully!")
						await interaction.reply({ embeds: [ EventsEmbed ], ephemeral: true });
					} else {
						EventsEmbed
							.setColor(color)
							.setDescription("❌ | An error occurred, please report it using ``/report bug`` so that it can be fixed immediately")
						await interaction.reply({ embeds: [ EventsEmbed ], ephemeral: true });
					}
					break;
			}
		}
	},
};