module.exports = {
	name: 'trackEnd',
	once: false,
	execute(track) {
        console.log(`Player Log : ${track.title} has finished playing!`)
	},
};