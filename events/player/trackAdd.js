module.exports = {
	name: 'trackAdd',
	once: false,
	execute(track) {
		console.log(`Player Log : Track ${track.title} added in the queue ✅`);
	},
};