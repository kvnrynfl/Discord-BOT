module.exports = {
	name: 'trackStart',
	once: false,
	async execute(queue, track) {
		console.log(`🎵 | TrackStart : Started playing ${track.title} in <#${queue.connection.channel.id}> RequestBy <@${track.requestedBy.id}>`);
		// console.log(queue);
		// console.log(track);
	},
};