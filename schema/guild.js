const mongoose = require("mongoose");
const { Schema, model } = mongoose;

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

module.exports = { guildSchema };