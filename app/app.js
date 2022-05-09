const express = require('express');

const songRouter = require('./routes/songRoutes');

// Initialize global services
require('./services/firebase');
require('./services/db');

// Middlewares import
const errorHandlerMiddleware = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded());

// Routes
app.use('/songs', songRouter)

// Example route
app.get('/', (req, res) => {
    res.send('Initial setup');
});

// Error handling middlewares
app.use(errorHandlerMiddleware);

module.exports = app;
