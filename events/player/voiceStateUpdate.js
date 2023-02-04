module.exports = {
	name: 'voiceStateUpdate',
	once: false,
	async execute(queue, oldState, newState) {
        console.log(`🎵 | VoiceStateUpdate : Voice state updated from ${oldState.channelId?? "NULL"} to ${newState.channelId}`);
		// console.log(queue);
		// console.log(oldState);
		// console.log(newState);
	},
};