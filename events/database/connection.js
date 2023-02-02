module.exports = {
	name: 'connection',
	once: false,
	async execute(connection) {
		connection.query('SET SESSION auto_increment_increment=1');
	},
};