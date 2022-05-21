const ApiError = require("../errors/apiError");
const Song = require("../models/songModel");
const QueryParser = require('../utils/queryParser');

const getAllSongsByQuery = async (req, res, next) => {

    const queryParams = ['artistId', 'albumId', 'genre']
    const queryParser = new QueryParser(queryParams);

    const query = queryParser.parseRequest(req);

    try {
        const filteredSongs = await Song.find(query).select("-_id");
        if (!filteredSongs.length) {
            const message = queryParser.getErrorMessageNotFound(req)
            next(ApiError.resourceNotFound(message));
        } else {
            res.status(200).json({
                data: filteredSongs,
            });
        }

    } catch (err) {
        next(ApiError.internalError("Internal error when getting songs"));
    }
};

const getSongById = async (req, res, next) => {
    const songId = req.params.id;

    const requestedSong = await Song.findById(songId).select("-_id -__v");

    if (requestedSong == null) {
        next(ApiError.resourceNotFound(`Song with id ${songId} doesn't exists`));
        return;
    }

    res.status(200).json({
        data: requestedSong,
    });
};

const createSong = async (req, res, next) => {
    const {title, artistId, albumId, duration, url, tier, genre, description} =
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
        next(ApiError.invalidArguments(`Invalid arguments passed`));
        return;
    }
};

module.exports = {
    getAllSongsByQuery,
    getSongById,
    createSong,
};
