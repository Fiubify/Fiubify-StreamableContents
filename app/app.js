const express = require('express');

// Initialize global services
require('./services/firebase');
require('./services/db');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded());

// Example route
app.get('/', (req, res) => {
    res.send('Initial setup');
});

module.exports = app;
