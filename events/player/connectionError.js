module.exports = {
	name: 'connectionError',
	once: false,
	execute(error) {
		console.log(`Player Log : Error emitted from the queue ${error.message}`);
	},
};