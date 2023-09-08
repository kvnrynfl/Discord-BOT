const mongoose = require('mongoose');
const { users } = require('../models/database');
require('dotenv').config();

async function allDataUser() {
    try {
        const users = await users.find();
        return users;
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return false;
    }
}

async function findDataUser(userId) {
    try {
        const user = await users.findOne({ userId: userId });
        return user;
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return false;
    }
}

async function inputDataUser(userId, globalName, username, discriminator, register_at) {
    try {
        const user = new users({
            userId: userId,
            globalName: globalName,
            username: username,
            discriminator: discriminator,
            register_at: register_at
        });

        await user.save();
        return true;
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return false;
    }
}

async function updateDataUser(userId, globalName, username, discriminator, register_at) {
    try {
        const user = await users.findOne({ userId: userId });
        if (globalName !== null) {
            user.globalName = globalName;
        }
        if (username !== null) {
            user.username = username;
        }
        if (discriminator !== null) {
            user.discriminator = discriminator;
        }
        if (register_at !== null) {
            user.register_at = register_at;
        }
        await user.save();
        return true;
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return false;
    }
}

async function deleteDataUser(userId) {
    try {
        await users.deleteOne({ userId: userId });
        return true;
    } catch (error) {
        console.log(`[ERROR] ${error.message}`);
        return false;
    }
}

module.exports = {
    allDataUser,
    findDataUser,
    inputDataUser,
    updateDataUser,
    deleteDataUser,
};
