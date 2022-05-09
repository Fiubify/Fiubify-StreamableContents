const mongoose = require('mongoose')

const songSchema = mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    artistId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true,
    },
    albumId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'Album'
    },
    duration: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true,
        unique: true
    }
});

module.exports = mongoose.model('Song', songSchema);
