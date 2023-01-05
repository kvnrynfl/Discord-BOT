module.exports = {
	name: 'trackAdd',
	once: false,
	execute(track) {
		console.log(`Track ${track.title} added in the queue ✅`);
	},
};