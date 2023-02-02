module.exports = {
	name: 'acquire',
	once: false,
	async execute(connection) {
		console.log(`Connection ${connection.threadId} acquired`);
	},
};