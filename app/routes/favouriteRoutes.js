const express = require("express");
const router = express.Router();

const favouritesController = require("../controllers/favouritesController");
const {protectUrlByUid} = require("../middleware/authorizationMiddleware");
const {validateReqBody} = require("../middleware/bodyValidationMiddleware");

const {favouriteInputSongSchema} = require("../schemas/favouritesSchema");

if (process.env.NODE_ENV === "DEV") {
    router.get("/:uid", favouritesController.getAllFavouritesSongs)
    router.post("/:uid/add-song", validateReqBody(favouriteInputSongSchema), favouritesController.addSongToFavourites);
    router.delete("/:uid/remove-song", validateReqBody(favouriteInputSongSchema), favouritesController.removeSongFromFavourites);
} else {
    router.get("/:uid", protectUrlByUid, favouritesController.getAllFavouritesSongs)
    router.post("/:uid/add-song", protectUrlByUid, validateReqBody(favouriteInputSongSchema), favouritesController.addSongToFavourites);
    router.delete("/:uid/remove-song", protectUrlByUid, validateReqBody(favouriteInputSongSchema), favouritesController.removeSongFromFavourites);
}


module.exports = router;