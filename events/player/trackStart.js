module.exports = {
	name: 'trackStart',
	once: false,
	async execute(track, queue) {
        console.log(`Started playing ${track.title} in ${queue.connection.channel.name} 🎧`);
		console.log(track);
		console.log(queue);
	},
};