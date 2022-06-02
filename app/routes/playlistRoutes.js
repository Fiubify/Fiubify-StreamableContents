const express = require("express");
const router = express.Router();

const playlistController = require("../controllers/playlistController")
const {protectUrlByPlaylistOwner} = require("../middleware/authorizationMiddleware");

router.get("/", playlistController.getPlaylists)
router.get("/:id", playlistController.getPlaylist)

if (process.env.NODE_ENV === "DEV") {
    router.post("/", playlistController.createPlaylist)
    router.post("/:id/add-track", playlistController.addTrackToPlaylist);
} else {
    router.post("/", protectUrlByPlaylistOwner, playlistController.createPlaylist)
    router.post("/:id/add-track", protectUrlByPlaylistOwner, playlistController.addTrackToPlaylist);
}

module.exports = router
