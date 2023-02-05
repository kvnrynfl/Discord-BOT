module.exports = {
	name: 'connectionError',
	once: false,
	async execute(queue, error) {
		console.log(`🎵 | ConnectionError : Error emitted from the queue ${error.massage}`);
		// console.log(queue);
		console.log(error);
	},
};