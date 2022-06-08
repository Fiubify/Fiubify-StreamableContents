const express = require("express");
const router = express.Router();

const playlistController = require("../controllers/playlistController")

router.post("/", playlistController.createPlaylist)
router.get("/", playlistController.getPlaylists)
router.get("/:id", playlistController.getPlaylist)
router.post("/:id/edit", playlistController.editPlaylist)
router.post("/:id/add-track", playlistController.addTrackToPlaylist)
router.post("/:id/remove-track", playlistController.removeTrackFromPlaylist)

module.exports = router
