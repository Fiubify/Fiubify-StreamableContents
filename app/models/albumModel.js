const mongoose = require('mongoose')

const songSchema = require('./songModel');

const albumSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  tracks: {
    type: [songSchema],
  },
  year: {
    type: Number
  },
  author_id: {
    type: String,
    required: true
  }
})

module.exports = mongoose.model('Album', albumSchema);
