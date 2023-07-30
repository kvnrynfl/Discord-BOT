const { Schema, Types } = require("mongoose");

const guildSchema = new Schema({
    id: {
        type: Number,
        index: true,
        unique: true,
        required: true,
    },
    name: {
        type: String,
        required: true,
    },
    owner: {
        type: Types.ObjectId,
        ref: "users",
    },
    registerAt: {
        type: Date,
        required: true,
    },
    createdAt: {
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