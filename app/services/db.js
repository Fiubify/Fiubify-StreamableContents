const mongoose = require("mongoose");

if (process.env.NODE_ENV != "TEST")
  mongoose
    .connect(process.env.MONGODB_URI || "mongodb://mongodb:27017/test", {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    })
    .then(() => console.log("Connected to mongo"))
    .catch((e) => console.log(e));
