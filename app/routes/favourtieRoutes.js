const express = require("express");
const router = express.Router();

const favouritesController = require("../controllers/favouritesController");


router.get("/:uid", favouritesController.getAllFavouritesSongs)
router.post("/:uid/add-song", favouritesController.addSongToFavourites);
router.delete("/:uid/remove-song", favouritesController.removeSongFromFavourites);

module.exports = router;