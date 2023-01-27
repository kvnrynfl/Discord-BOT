const { Events, EmbedBuilder } = require('discord.js');
const randomColor = require('randomcolor');

module.exports = {
	name: Events.InteractionCreate,
	once: false,
	async execute(interaction) {
		let color = randomColor();
		let EventsEmbed = new EmbedBuilder();
		// console.log(interaction);
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
				await interaction.reply({
					content: "❌ | An error occurred, please report it using ``/report bug`` so that it can be fixed immediately",
					ephemeral: true,
				});
			}
		} else if (interaction.isModalSubmit()) {
			await interaction.reply({ content: 'Your submission was received successfully!' });

			const textinput1 = interaction.fields.getTextInputValue('textinput1');
			const textinput2 = interaction.fields.getTextInputValue('textinput2');
			console.log({ textinput1, textinput2 });
		} else if (interaction.isStringSelectMenu()) {
			switch (interaction.customId) {
				case 'MusicPlay':
					// EventsEmbed
					// 	.setColor(color)
					// 	.setTitle(`**🤖 Logging Select Menu**`)
					// 	.setDescription(
					// 		`Guild : ${interaction.guildId}\n` +
					// 		`Channel : <#${interaction.channelId}>\n` +
					// 		`User : <@${interaction.user.id}>\n` +
					// 		`Costom Id : ${interaction.customId}\n` +
					// 		`Values String : ${interaction.values.toString()}`
					// 	);
					// interaction.reply({ embeds : [EventsEmbed], ephemeral : true });
					// console.log(interaction);
					break;
			
				default:
					console.log(`Unknow custom id button select menu`)
					break;
			}
		}
	},
};