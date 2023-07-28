const mongoose = require("mongoose");
const { Schema, model } = mongoose;

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

module.exports = { reportBugSchema };