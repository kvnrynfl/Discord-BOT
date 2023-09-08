const mongoose = require('mongoose');
require('dotenv').config();

const { userSchema } = require('./schemas/user');
const { guildSchema } = require('./schemas/guild');
const { playlistSchema } = require('./schemas/playlist');

const conn = mongoose.createConnection(process.env.DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const users = conn.model("users", userSchema);
const guilds = conn.model("guilds", guildSchema);
const playlists = conn.model("playlists", playlistSchema);

module.exports = {
    users,
    guilds,
    playlists,
};