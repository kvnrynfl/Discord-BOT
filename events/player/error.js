module.exports = {
	name: 'error',
	once: false,
	async execute(queue, error) {
		console.log(`🎵 | Error : Error emitted from the queue ${error.message}`);
		// console.log(queue);
		// console.log(error);
	},
};