const mongoose = require("mongoose");

const favouriteSchema = mongoose.Schema({
    userUid: {
        type: String,
        unique: true
    },
    tracks: {
        type: [mongoose.Schema.Types.ObjectId],
        ref: 'Song',
        required: true,
        default: []
    }
});

module.exports = mongoose.model('Favourite', favouriteSchema);
