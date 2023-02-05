module.exports = {
	name: 'tracksAdd',
	once: false,
	async execute(queue, track) {
        // console.log(`Player Log : Track ${track.title} added in the queue ✅`);
		console.log(`🎵 | TracksAdd : Track Size ${track.length} source ${track[0].playlist.source} type ${track[0].playlist.type} request by <@${track[0].requestedBy.id}> added to queue`);
		// console.log(queue);
		// console.log(track);
	},
};