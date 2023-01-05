module.exports = {
	name: 'trackEnd',
	once: false,
	execute(track) {
        console.log(`${track.title} has finished playing!`)
	},
};