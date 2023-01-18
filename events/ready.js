const { Events } = require('discord.js');
const { createConnection } = require('mysql');
const config = require('../config.json');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		connection = createConnection(config.mysql);
		connection.connect(error => {
			if (error) {
				return console.log(error);
			}
			console.log('MySQL has been connected!')
		});
		
		// client.user.setActivity("🤖 | /help")
		client.user.setActivity("🤖 | Maintenance | The bot is currently under development")
		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};