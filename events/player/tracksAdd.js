module.exports = {
	name: 'tracksAdd',
	once: false,
	async execute(track) {
        console.log(`Player Log : Track ${track.title} added in the queue ✅`);
	},
};