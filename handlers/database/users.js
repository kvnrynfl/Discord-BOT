const mongoose = require('mongoose');
const { users } = require('../../models/mongoDB');
require('dotenv').config();

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

module.exports = {
    findDataUser,
    inputDataUser,
    updateNameUser,
    updateTagUser,
};
