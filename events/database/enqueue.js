module.exports = {
	name: 'enqueue',
	once: false,
	async execute(connection) {
		console.log('Waiting for available connection slot');
	},
};