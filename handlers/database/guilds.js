const mongoose = require('mongoose');
const { guilds } = require('../../models/mongoDB');
require('dotenv').config();

async function findDataGuild(gId) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const guild = await guilds.find({ guildId: gId });
        return guild;
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return error;
    }
}

async function inputDataGuild(gId, gName, oId, oName, oTag, cAt) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const guildData = new guilds({
            guildId: gId,
            guildName: gName,
            guildOwner: {
                ownerId: oId,
                ownerName: oName,
                ownerTag: oTag,
            },
            createdAt: cAt
        });

        await guildData.save();
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
    }
}

async function updateNameGuild(gId, gName) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const userFind = await guilds.findOne({ guildId: gId }).exec();
        userFind.guildName = gName;
        await userFind.save();
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
    }
}

async function updateOwnerGuild(gId, oId, oName, oTag) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const userFind = await guilds.findOne({ userId: gId }).exec();
        userFind.guildOwner.ownerId = oId;
        userFind.guildOwner.ownerName = oName;
        userFind.guildOwner.ownerTag = oTag;
        await userFind.save();
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
    }
}

module.exports = {
    findDataGuild,
    inputDataGuild,
    updateNameGuild,
    updateOwnerGuild,
};
