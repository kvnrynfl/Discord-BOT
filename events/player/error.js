module.exports = {
	name: 'error',
	once: false,
	execute(error) {
		console.log(`Error emitted from the queue ${error.message}`);
	},
};