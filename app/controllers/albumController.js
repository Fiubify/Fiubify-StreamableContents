const ApiError = require("../errors/apiError");
const Album = require("../models/albumModel");

const getAllAlbumsByQuery = async (req, res, next) => {
  const artistId = req.query.artist;
  const tier = req.query.tier;

  const query = {};

  if (artistId) {
    query.artistId = artistId;
  }

  if (tier) {
    query.tier = tier;
  }

  try {
    const filteredAlbums = await Album.find(query).select("-_id");

    res.status(200).json({
      data: filteredAlbums,
    });
  } catch (err) {
    console.log(err);
    next(ApiError.internalError("Internal error when getting albums"));
    return;
  }
};

const getAlbumById = async (req, res, next) => {
  const albumId = req.params.id;

  const requestedAlbum = await Album.findById(albumId);

  if (requestedAlbum == null) {
    next(ApiError.resourceNotFound(`Album with id ${albumId} doesn't exists`));
    return;
  }

  res.status(200).json({
    data: requestedAlbum,
  });
};

module.exports = {
  getAllAlbumsByQuery,
  getAlbumById,
};
