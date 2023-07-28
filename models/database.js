const userSchema = require('../schema/user');
const guildSchema = require('../schema/guild');
const reportBugSchema = require('../schema/reportBug');

const users = model("users", userSchema);
const guilds = model("guilds", guildSchema);
const reportbugs = model("reportbugs", reportBugSchema);

module.exports = {
    users,
    guilds,
    reportbugs,
};