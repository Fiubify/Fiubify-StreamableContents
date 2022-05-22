const mongoose = require("mongoose");

const songSchema = require("./songSchema");

const albumSchema = mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    tracks: {
        type: [songSchema],
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
});

module.exports = mongoose.model("Album", albumSchema);
