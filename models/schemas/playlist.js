const { Schema, Types } = require("mongoose");

const guildSchema = new Schema({
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