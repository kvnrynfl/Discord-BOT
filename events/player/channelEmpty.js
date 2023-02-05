module.exports = {
	name: 'channelEmpty',
	once: false,
	async execute(queue) {
		console.log("EventPlayer | ChannelEmpty : Nobody is in the voice channel, leaving the voice channel... ❌");
		// console.log(queue);
	},
};