const mongoose = require("mongoose");

const favouriteSchema = mongoose.Schema({
    uid: {
        type: String,
        required: true,
        unique: true
    },
    tracks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Song',
        required: true,
        default: [],
    }
});

module.exports = mongoose.model('Favourite', favouriteSchema);
