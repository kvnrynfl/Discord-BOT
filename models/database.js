const { model } = require("mongoose");

const { userSchema } = require('./schemas/user');
const { guildSchema } = require('./schemas/guild');
const { playlistSchema } = require('./schemas/playlist');
const { reportBugSchema } = require('./schemas/reportBug');

const users = model("users", userSchema);
const guilds = model("guilds", guildSchema);
const playlists = model("playlists", playlistSchema);
const reportbugs = model("reportbugs", reportBugSchema);

module.exports = {
    users,
    guilds,
    playlists,
    reportbugs,
};