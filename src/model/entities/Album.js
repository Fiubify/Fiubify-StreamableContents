const mongoose = require('mongoose')

const AlbumSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  tracks: {
    type: Array,
    required: true
  },
  year: {
    type: Number
  },
  author_id: {
    type: String
  }
})