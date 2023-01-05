module.exports = {
	name: 'connectionError',
	once: false,
	execute(error) {
		console.log(`Error emitted from the queue ${error.message}`);
	},
};