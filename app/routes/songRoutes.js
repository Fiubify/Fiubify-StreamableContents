const express = require("express");
const router = express.Router();

const songControllers = require("../controllers/songControllers");

router.get("/", songControllers.getAllSongsByQuery);
router.get("/:id", songControllers.getSongById);
router.get("/:title", songControllers.getSongsByTitle);
router.post("/", songControllers.createSong);

module.exports = router;
