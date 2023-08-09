const { Schema, Types } = require("mongoose");

const reportBugSchema = new Schema({
    id: {
        type: Number,
        index: true,
        unique: true,
        required: true,
        immutable: true,
    },
    guild: {
        type: Types.ObjectId,
        ref: "guilds",
        required: true,
    },
    user: {
        type: Types.ObjectId,
        ref: "users",
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    title: {
        type: String,
        required: true,
    },
    screenshot: {
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