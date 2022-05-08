const express = require('express');
const router = express.Router();

const multer = require('multer');
const songControllers = require('../controllers/songControllers');

// Uploader for uploading songs
const uploader = multer({
    storage: multer.memoryStorage(),
    limits: {
        fileSize:  20 * 1024 * 1024
    }
})

router.get('/', songControllers.getAllSongsByQuery);
router.get('/:id', songControllers.getSongById);
router.post('/', uploader.single('song'), songControllers.createSong);

module.exports = router;
