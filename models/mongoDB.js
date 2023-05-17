const mongoose = require("mongoose");
const { Schema, model } = mongoose;


const userSchema = new Schema({
    userId: {
        type: Number,
        index: true,
        unique: true,
        required: true,
    },
    userName: {
        type: String,
        required: true,
    },
    userTag: {
        type: Number,
        required: true,
    },
    createdAt: {
        type: Date,
        required: true,
    },
    registerAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    updatedAt: Date,
});

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const guildSchema = new Schema({
    guildId: {
        type: Number,
        index: true,
        unique: true,
        required: true,
    },
    guildName: {
        type: String,
        required: true,
    },
    guildOwner: [ {
        ownerId: {
            type: String,
            required: true,
        },
        ownerName: {
            type: String,
            required: true,
        },
        ownerTag: {
            type: String,
            required: true,
        },
    } ],
    createdAt: {
        type: Date,
        required: true,
    },
    registerAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    updatedAt: Date,
});

guildSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const reportBugSchema = new Schema({
    reportId: {
        type: Number,
        index: true,
        unique: true,
        required: true,
        immutable: true,
    },
    guildId: {
        type: Number,
        index: true,
        required: true,
        ref: 'guilds'
    },
    userId: {
        type: Number,
        index: true,
        required: true,
        ref: 'users',
    },
    fullName: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    screenshotUrl: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: "Unread", //Under review //Approved //Closed
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    updatedAt: Date,
});

reportBugSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

const users = model("users", userSchema);
const guilds = model("guilds", guildSchema);
const reportBugs = model("reportbugs", reportBugSchema);

module.exports = {
    users,
    guilds,
    reportBugs,
};