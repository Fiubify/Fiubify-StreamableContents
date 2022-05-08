const Song = require('../models/songModel');
const firebaseStorage = require('../services/firebase').storage

const getAllSongsByQuery = async (req, res, next) => {
}

const getSongById = async (req, res, next) => {

}

const createSong = async (req, res, next) => {
    if(!req.file) {
        res.status(400).send('No file uploaded');
        return;
    }

    console.log(req.file.originalName);
    const blob = firebaseStorage.file(req.file.originalname);
    const bloblStream = blob.createWriteStream({
        metadata: {
            contentType: req.file.mimetype
        }
    });

    bloblStream.on('error', (err) => console.log(err));
    bloblStream.on('finish', () => {
        const publicUrl = `https://firebasestorage.googleapis.com/v0/b/${firebaseStorage.name}/o/${encodeURI(blob.name)}?alt=media`;

        res.status(200).send({
            fileName: req.file.originalname,
            fileLocation: publicUrl
        });
    });

    bloblStream.end(req.file.buffer);
}

module.exports = {
    getAllSongsByQuery,
    getSongById,
    createSong
}
