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

module.exports = { userSchema };