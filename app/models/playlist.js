const mongoose = require("mongoose")

const playlistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  ownerIds: {
    type: [ObjectId],
    required: true
  },
  collaborative: {
    type: Boolean,
    required: true,
    default: false
  },
  trackIds: {
    type: [ObjectId],
    required: true,
    default: []
  }
})

module.exports = mongoose.model("Playlist", playlistSchema);
