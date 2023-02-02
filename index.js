// Require the necessary classes
const { Client, Collection, GatewayIntentBits, Partials} = require('discord.js');
const { Player } = require('discord-player');
const mysql = require('mysql');
require('dotenv').config()

// Require file handlers
// const { handleLogs } = require("./handlers/handleLogs");
const { loadEvents } = require("./handlers/eventHandler");
const { loadCommands } = require("./handlers/commandHandler");
const { loadDatabase } = require("./handlers/databaseHandler");

// Create a new client instance
const client = new Client({ 
	intents: [
		GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMembers,
        GatewayIntentBits.GuildModeration,
        GatewayIntentBits.GuildEmojisAndStickers,
        GatewayIntentBits.GuildIntegrations,
        GatewayIntentBits.GuildWebhooks,
        GatewayIntentBits.GuildInvites,
		GatewayIntentBits.GuildVoiceStates,
        GatewayIntentBits.GuildPresences,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.GuildMessageReactions,
        GatewayIntentBits.GuildMessageTyping,
        GatewayIntentBits.DirectMessages,
        GatewayIntentBits.DirectMessageReactions,
        GatewayIntentBits.DirectMessageTyping,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildScheduledEvents,
        GatewayIntentBits.AutoModerationConfiguration,
        GatewayIntentBits.AutoModerationExecution,
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
});

client.database = mysql.createPool({
    connectionLimit : process.env.SQL_LIMIT,
    host	        : process.env.SQL_HOST,
    user	        : process.env.SQL_USER,
    password        : process.env.SQL_PASSWORD,
    database        : process.env.SQL_DATABASE
});

// Log in to Discord with your client's token
// Loaded All file Handlers
client.login(process.env.CLIENT_TOKEN).then(() => {
	loadEvents(client);
	loadCommands(client);
	loadDatabase(client);
});
