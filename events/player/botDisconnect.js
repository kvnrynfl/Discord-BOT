module.exports = {
	name: 'botDisconect',
	once: false,
	async execute(queue) {
		console.log("EventPlayer | BotDisconected : I was manually disconnected from the voice channel, clearing queue...");
		// console.log(queue);
	},
};