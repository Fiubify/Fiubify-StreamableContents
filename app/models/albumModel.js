const mongoose = require("mongoose");

const songSchema = require("./songSchema");

const albumSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    tracks: {
        type: [songSchema],
        default: []
    },
    artistId: {
        type: String,
        required: true,
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
});

module.exports = mongoose.model("Album", albumSchema);
