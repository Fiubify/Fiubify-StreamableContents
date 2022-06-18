const express = require("express");
const router = express.Router();

const favouritesController = require("../controllers/favouritesController");
const {protectUrlByUid} = require("../middleware/authorizationMiddleware");

if (process.env.NODE_ENV === "DEV") {
    router.get("/:uid", favouritesController.getAllFavouritesSongs)
    router.post("/:uid/add-song", favouritesController.addSongToFavourites);
    router.delete("/:uid/remove-song", favouritesController.removeSongFromFavourites);
} else {
    router.get("/:uid", protectUrlByUid, favouritesController.getAllFavouritesSongs)
    router.post("/:uid/add-song", protectUrlByUid, favouritesController.addSongToFavourites);
    router.delete("/:uid/remove-song", protectUrlByUid, favouritesController.removeSongFromFavourites);
}


module.exports = router;