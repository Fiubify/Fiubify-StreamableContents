const express = require("express");
const router = express.Router();

const songControllers = require("../controllers/songControllers");
const {songInputSchema} = require("../schemas/songsInputSchema");

const validateReqBody = require("../middleware/bodyValidationMiddleware");
const {protectByAdminRole} = require("../middleware/authorizationMiddleware");

router.get("/", songControllers.getAllSongsByQuery);
router.post("/", validateReqBody(songInputSchema), songControllers.createSong);
router.get("/:id", songControllers.getSongById);
router.patch("/:id/block", songControllers.blockSong);
router.patch("/:id/unblock", songControllers.unblockSong);

if (process.env.NODE_ENV === "DEV") {
    router.patch("/:id/block", songControllers.blockSong);
    router.patch("/:id/unblock", songControllers.unblockSong);
} else {
    router.patch("/:id/block", protectByAdminRole, songControllers.blockSong);
    router.patch("/:id/unblock", protectByAdminRole, songControllers.unblockSong);
}


module.exports = router;
