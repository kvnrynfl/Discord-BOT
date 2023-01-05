module.exports = {
	name: 'trackStart',
	once: false,
	execute(track, queue) {
        console.log(`Started playing ${track.title} in ${queue.connection.channel.name} 🎧`);
	},
};