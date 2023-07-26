module.exports = {
    name: 'voiceStateUpdate',
    once: false,
    async execute(queue, oldState, newState) {
        // Emitted when the voice state is updated. 
        // Consuming this event may disable default voice state update handler if `Player.isVoiceStateHandlerLocked()` returns `false`.
    }
};