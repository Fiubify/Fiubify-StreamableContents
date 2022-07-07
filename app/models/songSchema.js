const mongoose = require("mongoose");

const songSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    artistId: {
        type: String,
        required: true,
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Album",
    },
    duration: {
        type: Number,
        required: true,
    },
    url: {
        type: String,
        required: true,
        unique: true,
        sparse: true
    },
    tier: {
        type: String,
        required: true,
        default: "Free",
    },
    genre: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    disabled: {
        type: Boolean,
        default: false
    }
});

module.exports = songSchema;
