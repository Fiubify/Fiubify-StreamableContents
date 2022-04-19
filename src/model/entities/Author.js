const mongoose = require('mongoose')

const AuthorSchema = mongoose.Schema({
  name: {
    type: String,
    required: true
  }
})