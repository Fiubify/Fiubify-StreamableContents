const express = require('express');
const router = express.Router();

const songControllers = require('../controllers/songControllers');

router.get('/', songControllers.getAllSongsByQuery);
router.get('/:id', songControllers.getSongById);
router.post('/', songControllers.createSong);

module.exports = router;
