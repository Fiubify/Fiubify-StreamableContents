const express = require("express");
const router = express.Router();

const songControllers = require("../controllers/songControllers");
const {songInputSchema} = require("../schemas/songsInputSchema");

const validateReqBody = require("../middleware/bodyValidationMiddleware");

router.get("/", songControllers.getAllSongsByQuery);
router.get("/:id", songControllers.getSongById);
if (process.env.NODE_ENV === "DEV") {
    router.post("/", validateReqBody(songInputSchema), songControllers.createSong);
} else {
    router.post("/", validateReqBody(songInputSchema), songControllers.createSong);
}


module.exports = router;
