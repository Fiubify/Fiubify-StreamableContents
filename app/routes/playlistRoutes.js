const express = require("express");
const router = express.Router();

const playlistController = require("../controllers/playlistController")
const {protectUrlByPlaylistOwner} = require("../middleware/authorizationMiddleware");

router.get("/", playlistController.getPlaylists)
router.get("/:id", playlistController.getPlaylist)
router.post("/", playlistController.createPlaylist)
router.post("/:id/edit", playlistController.editPlaylist)
router.post("/:id/add-track", playlistController.addTrackToPlaylist)
router.post("/:id/remove-track", playlistController.removeTrackFromPlaylist)

if (process.env.NODE_ENV === "DEV") {
    router.post("/:id/add-track", playlistController.addTrackToPlaylist)
} else {
    router.post("/:id/add-track", protectUrlByPlaylistOwner, playlistController.addTrackToPlaylist);
}

module.exports = router
