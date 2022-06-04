const express = require("express");
const router = express.Router();

const songControllers = require("../controllers/songControllers");
const {protectUrlBySongOwner} = require("../middleware/authorizationMiddleware");
const validateReqBody = require("../middleware/bodyValidationMiddleware");

router.get("/", songControllers.getAllSongsByQuery);
router.get("/:id", songControllers.getSongById);
if (process.env.NODE_ENV === "DEV") {
    router.post("/", validateReqBody(['title', 'artistId', 'albumId', 'duration', 'url', 'tier', 'genre', 'description']), songControllers.createSong);
} else {
    router.post("/", protectUrlBySongOwner, validateReqBody(['title', 'artistId', 'albumId', 'duration', 'url', 'tier', 'genre', 'description']), songControllers.createSong);
}


module.exports = router;
