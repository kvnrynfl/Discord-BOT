const mongoose = require('mongoose');
const AsciiTable = require('ascii-table');
const { users, guilds } = require('../models/mongoDB');
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

async function findDataUser(uId) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const user = await users.find({ userId: uId });
        return user;
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return error;
    }
}

async function inputDataUser(uId, uName, uTag, cAt) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const userData = new users({
            userId: uId,
            userName: uName,
            userTag: uTag,
            createdAt: cAt
        });

        await userData.save();
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
    }
}

async function updateNameUser(uId, uName) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const userFind = await users.findOne({ userId: uId }).exec();
        userFind.userName = uName;
        await userFind.save();
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
    }
}

async function updateTagUser(uId, uTag) {
    try {
        await mongoose.set('strictQuery', false);
        await mongoose.connect(process.env.DB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            // keepAlive: true,
        });
        const userFind = await users.findOne({ userId: uId }).exec();
        userFind.userTag = uTag;
        await userFind.save();
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
    }
}

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
    } else if (checkDataGuild[0].guildguildOwner.ownerId != guildOwner.user.id || checkDataGuild[0].guildguildOwner.ownerName != guildOwner.user.username || checkDataGuild[0].guildguildOwner.ownerTag != guildOwner.user.discriminator) {
        await updateOwnerGuild(interaction.guild.id, guildOwner.user.id, guildOwner.user.username, guildOwner.user.discriminator);
    }
}

module.exports = {
    loadDatabase,
    findDataUser,
    inputDataUser,
    updateNameUser,
    updateTagUser,
    findDataGuild,
    inputDataGuild,
    updateNameGuild,
    updateOwnerGuild,
    interactionDataUpdate
};
