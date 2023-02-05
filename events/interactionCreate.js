const { Events, EmbedBuilder } = require('discord.js');
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

			if (!interaction.guild) {
				EventsEmbed
					.setColor(color)
					.setDescription("❌ |  Youcannot use the slash command in direct messages")
				return interaction.reply({ embeds : [EventsEmbed], ephemeral: true })
			}

			try {
				await command.execute(interaction);
			} catch (error) {
				console.error(`Error executing ${interaction.commandName}`);
				console.error(error);
				EventsEmbed
					.setColor(color)
					.setDescription("❌ | An error occurred, please report it using ``/report bug`` so that it can be fixed immediately")
				return interaction.reply({ embeds : [EventsEmbed], ephemeral: true })
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
					var post  = {
						user_id: `${interaction.user.id}`,
						guild_id: `${interaction.guildId}`,
						fullname: `${interaction.fields.getTextInputValue('InputGeneralReportBug1')}`,
						whathappened: `${interaction.fields.getTextInputValue('InputGeneralReportBug2')}`
					};

					try {
						interaction.client.database.getConnection(async function(err, connection) {
							if (err) {
								console.log(err);
							}
							await connection.query(`INSERT INTO reportbug SET ?`, post, function(error, result, fields) {
								if (error) {
									console.log(`[WARNING] ModalSubmit ReportBug : ${error.message}`);
								};
							});
						});
						EventsEmbed
							.setColor(color)
							.setDescription("✅ | Your submission was received successfully!")
						await interaction.reply({ embeds : [EventsEmbed], ephemeral: true });
					} catch (error) {
						EventsEmbed
							.setColor(color)
							.setDescription("❌ | An error occurred, please report it using ``/report bug`` so that it can be fixed immediately")
						return interaction.reply({ embeds : [EventsEmbed], ephemeral: true })
					}
					break;
			}
		} 
	},
};