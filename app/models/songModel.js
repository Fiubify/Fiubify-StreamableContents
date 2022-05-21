const mongoose = require("mongoose");
const songSchema = require("./songSchema");

module.exports = mongoose.model("Song", songSchema);
