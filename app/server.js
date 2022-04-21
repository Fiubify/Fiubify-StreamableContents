const express = require('express')
const mongoose = require('mongoose')

const app = express();

const routes = require('./routes.js')
app.use('/', routes)

// DB connection
mongoose.connect('mongodb://mongodb:27017/db', { useNewUrlParser: true }) // Relacionar la URL al entorno
        .then(() => console.log('MongoDB connected'))
        .catch(err => console.log(err))

// listen
app.listen(3000);