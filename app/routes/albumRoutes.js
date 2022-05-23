const express = require("express");
const router = express.Router();

const albumControllers = require("../controllers/albumController");
const {protectUrlByAlbumOwner} = require("../middleware/authorizationMiddleware");

router.get("/", albumControllers.getAllAlbumsByQuery);
router.get("/:id", albumControllers.getAlbumById);
router.post("/", protectUrlByAlbumOwner, albumControllers.createAlbum);
router.post("/:id/add-song", protectUrlByAlbumOwner, albumControllers.createSongAndAddToAlbum);

module.exports = router;
