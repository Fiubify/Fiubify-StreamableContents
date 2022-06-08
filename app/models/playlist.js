const mongoose = require("mongoose")

const ownerSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  id: {
    type: String
  }
})

const playlistSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  owners: {
    type: [ownerSchema]
  },
  collaborative: {
    type: Boolean,
    required: true,
    default: false
  },
  tracks: {
    type: [String],
    ref: 'Song',
    required: true,
    default: []
  }
})

module.exports = mongoose.model("Playlist", playlistSchema);
