const express = require("express");

// Initialize global services
require("./services/db");

// Middlewares import
const errorHandlerMiddleware = require("./middleware/errorHandler");

const app = express();

// Middlewares
app.use(express.json());
app.use(express.urlencoded());

// Routes
const songRouter = require("./routes/songRoutes");
const albumRouter = require("./routes/albumRoutes");
const playlistRouter = require("./routes/playlistRoutes");
const favouriteRouter = require("./routes/favourtieRoutes");

app.use("/songs", songRouter);
app.use("/albums", albumRouter);
app.use("/playlists", playlistRouter);
app.use("/favourites", favouriteRouter);

// Example route
app.get("/", (req, res) => {
    res.send("Initial setup");
});

// Error handling middlewares
app.use(errorHandlerMiddleware);

module.exports = app;
