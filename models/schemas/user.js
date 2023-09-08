const { Schema } = require("mongoose");

const userSchema = new Schema({
    userId: {
        type: Number,
        index: true,
        unique: true,
        required: true,
    },
    globalName: {
        type: String,
        required: true,
    },
    username: {
        type: String,
        required: true,
    },
    discriminator: {
        type: Number,
        required: true,
    },
    register_at: {
        type: Date,
        required: true,
    },
    created_at: {
        type: Date,
        default: () => Date.now(),
        immutable: true,
    },
    updated_at: Date,
});

userSchema.pre('save', function (next) {
    this.updatedAt = Date.now();
    next();
});

module.exports = { userSchema };