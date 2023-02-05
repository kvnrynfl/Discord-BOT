module.exports = {
	name: 'trackAdd',
	once: false,
	async execute(queue, track) {
		console.log(`🎵 | TrackAdd : Track ${track.title} request by <@${track.requestedBy.id}> added to queue`);
		// console.log(queue);
		// console.log(track);
	},
};