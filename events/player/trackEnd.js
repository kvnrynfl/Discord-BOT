module.exports = {
	name: 'trackEnd',
	once: false,
	async execute(queue, track) {
		console.log(`🎵 | TrackEnd : ${track.title} has finished playing`);
		// console.log(queue);
		// console.log(track);
	},
};