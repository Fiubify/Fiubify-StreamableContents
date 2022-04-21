const mongoose = require('mongoose')

const StreamableContentSchema = mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  duration: {
    type: Number,
    required: true
  },
  year: {
    type: Number
  },
  author_id: {
    type: String,
    required: true
  },
})