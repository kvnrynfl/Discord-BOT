module.exports = {
	name: 'queueEnd',
	once: false,
	async execute(queue) {
		console.log("🎵 | QueueEnd : Successfully complete all the music in the queue");
		// console.log(queue);
	},
};