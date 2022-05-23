const express = require("express");
const router = express.Router();

const songControllers = require("../controllers/songControllers");
const {protectUrlBySongOwner} = require("../middleware/authorizationMiddleware");

router.get("/", songControllers.getAllSongsByQuery);
router.get("/:id", songControllers.getSongById);
router.post("/", protectUrlBySongOwner, songControllers.createSong);

module.exports = router;
