const express = require("express");
const router = express.Router();

const playlistController = require("../controllers/playlistController")

router.get("/", playlistController.getPlaylists)
router.get("/:id", playlistController.getPlaylist)
router.post("/", playlistController.createPlaylist)
router.post("/:id/add-track", playlistController.addTrackToPlaylist);

module.exports = router
