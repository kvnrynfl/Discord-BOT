const { Schema, Types } = require("mongoose");

const playlistSchema = new Schema({
    name: {
        type: Number,
        index: true,
        unique: true,
        required: true,
    },
    type: {
        type: String,
        required: true,
    },
    url: {
        type: String,
        required: true,
    },
    owner: {
        type: Types.ObjectId,
        ref: "users",
    },
    active: {
        type: Boolean,
        default: true,
    },
    createdAt: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    updatedAt: Date,
});

playlistSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = { playlistSchema };