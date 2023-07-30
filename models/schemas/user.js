const { Schema } = require("mongoose");

const userSchema = new Schema({
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
    tag: {
        type: Number,
        required: true,
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

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = { userSchema };