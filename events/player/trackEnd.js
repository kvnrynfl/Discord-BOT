module.exports = {
	name: 'trackEnd',
	once: false,
	async execute(track) {
        console.log(`Player Log : ${track.title} has finished playing!`)
	},
};