const { Readable } = require("stream");
const ApiError = require("../errors/apiError");
const Song = require("../models/songModel");

const firebaseStorage = require("../services/firebase").storage;
const firebaseSongsManager =
  require("../utils/firebaseSongsManager").FirebaseSongsManager;

const songsManager = new firebaseSongsManager(firebaseStorage);

const getAllSongsByQuery = async (req, res, next) => {
  const albumId = req.query.album;
  const artistId = req.query.artist;

  const query = {};

  if (artistId) {
    query.artistId = artistId;
  }

  if (albumId) {
    query.albumId = albumId;
  }

  try {
    const filteredSongs = await Song.find(query).select("-_id");

    res.status(200).json({
      data: filteredSongs,
    });
  } catch (err) {
    console.log(err);
    next(ApiError.internalError("Internal error when getting songs"));
  }
};

const getSongById = async (req, res, next) => {
  const songId = req.params.id;

  const requestedSong = await Song.findById(songId);

  if (requestedSong == null) {
    next(ApiError.resourceNotFound(`Song with id ${songId} doesn't exists`));
    return;
  }

  res.status(200).json({
    data: {
      title: requestedSong.title,
      albumId: requestedSong.albumId,
      artistId: requestedSong.artistId,
      url: requestedSong.url,
      duration: requestedSong.duration,
    },
  });
};

const createSong = async (req, res, next) => {
  const { title, artistId, albumId, duration } = req.body;

  if (!req.file) {
    next(ApiError.invalidArguments("No file uploaded !"));
    return;
  }

  // Create Song uploader for loading the song to firebase Storage
  const songUploader = songsManager.createSongUploader(
    req.file,
    title,
    albumId,
    artistId
  );

  // Set Up all the events
  songUploader.setUpErrorEvent((err) => next(ApiError.internalError(err)));
  songUploader.setUpFinishEvent(async () => {
    try {
      const newSong = new Song({
        title: title,
        artistId: artistId,
        albumId: albumId,
        duration: duration,
        url: songUploader.getFilePublicUrl(),
      });

      const mongoCreatedSong = await newSong.save();

      res.status(201).send({
        id: mongoCreatedSong.id,
        fileName: songUploader.getFileName(),
        fileLocation: songUploader.getFilePublicUrl(),
      });
    } catch (err) {
      console.log(err);
      next(ApiError.invalidArguments(`Invalid arguments passed`));
      return;
    }
  });

  // Set Up the input stream
  songUploader.setUpInputPipe(Readable.from(req.file.buffer.toString()));
};

module.exports = {
  getAllSongsByQuery,
  getSongById,
  createSong,
};
