const {Readable} = require('stream');
const ApiError = require('../errors/apiError')
const Song = require('../models/songModel');

const firebaseStorage = require('../services/firebase').storage
const firebaseSongsManager = require('../utils/firebaseSongsManager').FirebaseSongsManager;


const songsManager = new firebaseSongsManager(firebaseStorage);

const getAllSongsByQuery = async (req, res, next) => {
}

const getSongById = async (req, res, next) => {

}

const createSong = async (req, res, next) => {
    const {title, artistId, albumId, duration} = req.body;

    if (!req.file) {
        res.status(400).send('No file uploaded');
        return;
    }

    // Create Song uploader for loading the song to firebase Storage
    const songUploader = songsManager.createSongUploader(req.file, title, albumId, artistId);

    // Set Up all the events
    songUploader.setUpErrorEvent((err) => next(ApiError.internalError(err)));
    songUploader.setUpFinishEvent(async () => {
            try {
                const newSong = new Song({
                    title: title,
                    artistId: artistId,
                    albumId: albumId,
                    duration: duration,
                    url: songUploader.getFilePublicUrl()
                });

                const mongoCreatedSong = await newSong.save();

                res.status(200).send({
                    id: mongoCreatedSong.id,
                    fileName: songUploader.getFileName(),
                    fileLocation: songUploader.getFilePublicUrl()
                });
            } catch (err) {
                console.log(err);
                next(ApiError.invalidArguments(`Invalid arguments passed`));
            }
        }
    );

    // Set Up the input stream
    songUploader.setUpInputPipe(Readable.from(req.file.buffer.toString()));
}

module.exports = {
    getAllSongsByQuery,
    getSongById,
    createSong
}
