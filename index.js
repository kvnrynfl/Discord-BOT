// Require the necessary classes
const { Client, Collection, GatewayIntentBits, Partials} = require('discord.js');
const { token } = require('./config.json');
const { Player } = require("discord-player");

// Require file handlers
// const { handleLogs } = require("./handlers/handleLogs");
const { loadEvents } = require("./handlers/eventHandler");
const { loadCommands } = require("./handlers/commandHandler");

// Create a new client instance
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildBans,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
		GatewayIntentBits.GuildVoiceStates,
	],
	partials: [
        Partials.User,
        Partials.Channel,
        Partials.GuildMember,
        Partials.Message,
        Partials.Reaction,
        Partials.GuildScheduledEvent,
        Partials.ThreadMember,
    ], 
	disableMentions: 'everyone',
});


// Create a new collection of commands for commandHandler
client.commands = new Collection();


client.player = new Player(client, {
    ytdlOptions: {
        quality: "highestaudio",
        highWaterMark: 1 << 25
    }
})

// Log in to Discord with your client's token
// Loaded All file Handlers
client.login(token).then(() => {
	loadEvents(client);
	loadCommands(client);
});
