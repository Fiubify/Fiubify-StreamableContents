const ApiError = require("../errors/apiError");
const Album = require("../models/albumModel");
const QueryParser = require('../utils/queryParser');

const getAllAlbumsByQuery = async (req, res, next) => {

  const listOfQueryKeys = ['artistId', 'tier'];
  const queryParser = new QueryParser(listOfQueryKeys)

  const query = queryParser.parseRequest(req);

  try {
    const filteredAlbums = await Album.find(query).select("-_id -__v");

    if (!filteredAlbums.length) {
      const message = queryParser.getErrorMessageNotFound(req);
      next(ApiError.resourceNotFound(message));
      return;
    }

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

  const requestedAlbum = await Album.findById(albumId).select("-_id -__v");

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
