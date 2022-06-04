const express = require("express");
const router = express.Router();

const albumControllers = require("../controllers/albumController");
const {songIntoAlbumInputSchema} = require("../schemas/songsInputSchema");
const {albumInputSchema} = require("../schemas/albumsInputSchema");

const {protectUrlByAlbumOwner} = require("../middleware/authorizationMiddleware");
const validateReqBody = require("../middleware/bodyValidationMiddleware");

router.get("/", albumControllers.getAllAlbumsByQuery);
router.get("/:id", albumControllers.getAlbumById);

if (process.env.NODE_ENV === "DEV") {
    router.post("/", validateReqBody(albumInputSchema), albumControllers.createAlbum);
    router.post("/:id/add-song", validateReqBody(songIntoAlbumInputSchema), albumControllers.createSongAndAddToAlbum);
} else {
    router.post("/", protectUrlByAlbumOwner, validateReqBody(albumInputSchema), albumControllers.createAlbum);
    router.post("/:id/add-song", protectUrlByAlbumOwner, validateReqBody(songIntoAlbumInputSchema), albumControllers.createSongAndAddToAlbum);
}

module.exports = router;
