const express = require("express");
const router = express.Router();

const playlistController = require("../controllers/playlistController")
const {protectUrlByPlaylistOwner} = require("../middleware/authorizationMiddleware");

router.post("/", playlistController.createPlaylist)
router.get("/", playlistController.getPlaylists)
router.get("/:id", playlistController.getPlaylist)
router.post("/:id/edit", playlistController.editPlaylist)
router.post("/:id/add-track", playlistController.addTrackToPlaylist)
router.post("/:id/remove-track", playlistController.removeTrackFromPlaylist)

if (process.env.NODE_ENV === "DEV") {
    router.post("/", playlistController.createPlaylist)
    router.post("/:id/edit", playlistController.editPlaylist)
    router.post("/:id/add-track", playlistController.addTrackToPlaylist)
    router.post("/:id/remove-track", playlistController.removeTrackFromPlaylist)
} else {
    router.post("/", protectUrlByPlaylistOwner, playlistController.createPlaylist)
    router.post("/:id/edit", protectUrlByPlaylistOwner, playlistController.editPlaylist)
    router.post("/:id/add-track", protectUrlByPlaylistOwner, playlistController.addTrackToPlaylist);
    router.post("/:id/remove-track", protectUrlByPlaylistOwner, playlistController.removeTrackFromPlaylist)
}

module.exports = router
