const { Events } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		client.user.setActivity("🤖 | /help")
		// client.user.setActivity("🤖 | Maintenance | The bot is currently under development")
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};