module.exports = {
	name: 'botDisconect',
	once: false,
	execute() {
		console.log('I was manually disconnected from the voice channel, clearing queue... ❌');
	},
};