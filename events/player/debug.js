module.exports = {
	name: 'debug',
	once: false,
	execute(info) {
		console.log(`Debug info: ${info}`);
	},
};