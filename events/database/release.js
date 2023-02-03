module.exports = {
	name: 'release',
	once: false,
	async execute(connection) {
		console.log(`Connection ${connection.threadId} released`);
	},
};