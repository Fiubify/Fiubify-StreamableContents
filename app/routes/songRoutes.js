const express = require("express");
const router = express.Router();

const songControllers = require("../controllers/songControllers");
const {protectUrlBySongOwner} = require("../middleware/authorizationMiddleware");

router.get("/", songControllers.getAllSongsByQuery);
router.get("/:id", songControllers.getSongById);
if (process.env.NODE_ENV === "DEV") {
    router.post("/", songControllers.createSong);
} else {
    router.post("/", protectUrlBySongOwner, songControllers.createSong);
}

module.exports = router;
