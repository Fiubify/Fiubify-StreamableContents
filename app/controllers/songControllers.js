const ApiError = require("../errors/apiError");
const Song = require("../models/songModel");

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
  const { title, artistId, albumId, duration, url, tier, genre, description } =
    req.body;
  try {
    const newSong = new Song({
      title: title,
      artistId: artistId,
      albumId: albumId,
      duration: duration,
      url: url,
      tier: tier,
      genre: genre,
      description: description,
    });

    await newSong.save();

    res.status(201).send({});
  } catch (err) {
    console.log(err);
    next(ApiError.invalidArguments(`Invalid arguments passed`));
    return;
  }
};

module.exports = {
  getAllSongsByQuery,
  getSongById,
  createSong,
};
