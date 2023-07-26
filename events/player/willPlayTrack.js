module.exports = {
    name: 'willPlayTrack',
    once: false,
    async execute(queue, track, config, done) {
        // Emitted before streaming an audio track. This event can be used to modify stream config before playing a track.
        // Listening to this event will pause the execution of audio player until `done()` is invoked.
    }
};