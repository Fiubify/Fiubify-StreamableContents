const express = require("express");
const router = express.Router();

const albumControllers = require("../controllers/albumController");

router.get("/", albumControllers.getAllAlbumsByQuery);
router.get("/:id", albumControllers.getAlbumById);

module.exports = router;
