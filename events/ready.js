const { Events, ActivityType, PresenceUpdateStatus } = require('discord.js');

module.exports = {
	name: Events.ClientReady,
	once: true,
	execute(client) {
		// ActivityType => Playing, Streaming, Listening, Watching, Custom, Playing.
		// PresenceUpdateStatus => DoNotDisturb, Idle, Invisible, Offline, Online.

		let activities = [
			'🤖 | /help',
			'🤖 | /info',
			'🤖 | /play',
			'🤖 | /report',
		];

		setInterval(() => {
			let random = Math.floor(Math.random() * activities.length);
			client.user.setPresence({ 
				activities: [{ 
					name: activities[random], 
					type: ActivityType.Playing,
					url: "https://www.youtube.com/channel/UCZrWRprNd7CgqLALR8nnBHQ",
				}], 
				status: PresenceUpdateStatus.Online, 
				afk: false,
			});
		}, 10000);
		
		// client.user.setPresence({
		// 	activities: [
		// 		{
		// 			name: '🤖 | Maintenance | The bot is currently under development',
		// 			type: ActivityType.Listening,
		// 			url: "https://www.youtube.com/channel/UCZrWRprNd7CgqLALR8nnBHQ",
		// 		}
		// 	],
		// 	status: PresenceUpdateStatus.DoNotDisturb,
		// 	afk: true,
		// });

		console.log(`Ready! Logged in as ${client.user.tag}`);
	},
};