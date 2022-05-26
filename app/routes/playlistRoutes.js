const express = require("express");
const router = express.Router();

const playlistController = require("../controllers/playlistController")

router.get("/", playlistController.getPlaylists)
router.get("/:id", playlistController.getPlaylist)
router.post("/", playlistController.createPlaylist)

module.exports = router