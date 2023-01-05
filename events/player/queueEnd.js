module.exports = {
	name: 'queueEnd',
	once: false,
	execute() {
		console.log('I finished reading the whole queue ✅');
	},
};