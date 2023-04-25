const { Schema, SchemaType, model } = require("mongoose");

const userSchema = new Schema({
    userId: {
        type: Number,
        required: true,
        unique: true,
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
        required: true,
        unique: true,
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
    guildId: {
        type: Number,
        required: true,
    },
    userId: {
        type: Number,
        required: true,
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
        default: "Unread" //Under review //Approved
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

module.exports = {
    users: model("users", userSchema),
    guilds: model("guilds", guildSchema),
    reportBugs: model("reportBugs", reportBugSchema),
};