const mongoose = require('mongoose');
const AsciiTable = require('ascii-table');
const { users, guilds, reportBugs } = require('../models/mongoDB');
const { findDataUser, inputDataUser, updateNameUser, updateTagUser} = require('./database/users');
const { findDataGuild, inputDataGuild, updateNameGuild, updateOwnerGuild } = require('./database/guilds');
const { countDataReportBug, findDataReportBug, inputDataReportBug, updateStatusReportBug } = require('./database/reportBugs');
require('dotenv').config();

async function loadDatabase() {
    const table = new AsciiTable()
        .setHeading('Status', 'Table', 'Columns', 'Total Value')
        .setAlignCenter(0)
        .setAlignCenter(2)
        .setAlignCenter(3);

    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const collections = await mongoose.connection.db.listCollections().toArray();

        for (const collection of collections) {
            const Model = mongoose.model(collection.name);

            const total = await Model.countDocuments();

            table.addRow('✔', collection.name, Object.keys(Model.schema.paths).length, total);
        }

        console.log(table.toString());
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
    }
}

async function interactionDataUpdate(interaction) {
    const checkDataUser = await findDataUser(interaction.user.id);
    const checkDataGuild = await findDataGuild(interaction.guild.id)
    const guildOwner = await interaction.guild.fetchOwner(); 
    
    if (checkDataUser.length == 0 || checkDataUser[0].userId != interaction.user.id) {
        await inputDataUser(interaction.user.id, interaction.user.username, interaction.user.discriminator, interaction.user.createdAt);
    } else if (checkDataUser[0].userName != interaction.user.username) {
        await updateNameUser(interaction.user.id, interaction.user.username);
    } else if (checkDataUser[0].userTag != interaction.user.discriminator) {
        await updateTagUser(interaction.user.id, interaction.user.discriminator);
    }
    
    if (checkDataGuild.length == 0 || checkDataGuild[0].guildId != interaction.guild.id) {
        await inputDataGuild(interaction.guild.id, interaction.guild.name, guildOwner.user.id, guildOwner.user.username, guildOwner.user.discriminator, interaction.guild.createdAt);
    } else if (checkDataGuild[0].guildName != interaction.guild.name) {
        await updateNameGuild(interaction.guild.id, interaction.guild.name);
    } else if (checkDataGuild[0].guildOwner[0].ownerId != guildOwner.user.id || checkDataGuild[0].guildOwner[0].ownerName != guildOwner.user.username || checkDataGuild[0].guildOwner[0].ownerTag != guildOwner.user.discriminator) {
        await updateOwnerGuild(interaction.guild.id, guildOwner.user.id, guildOwner.user.username, guildOwner.user.discriminator);
    }
}

module.exports = {
    loadDatabase,
    interactionDataUpdate,
    findDataUser,
    inputDataUser,
    updateNameUser,
    updateTagUser,
    findDataGuild,
    inputDataGuild,
    updateNameGuild,
    updateOwnerGuild,
    countDataReportBug,
    findDataReportBug,
    inputDataReportBug,
    updateStatusReportBug
};
