const ApiError = require("../errors/apiError");
const Song = require("../models/songModel");
const QueryParser = require('../utils/queryParser');

const getAllSongsByQuery = async (req, res, next) => {

    try {
        const queryParams = ['artistId', 'albumId', 'genre', 'tier'];
        const queryParamsContained = ['title'];
        const queryParser = new QueryParser(queryParams, queryParamsContained);

        const query = queryParser.parseRequest(req);


            const filteredSongs = await Song.find(query).select("");
            if (!filteredSongs.length && Object.keys(query).length !== 0) {
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
    try {
        const songId = req.params.id;

        const requestedSong = await Song.findById(songId).select("-_id -__v");
    
        if (requestedSong == null) {
            next(ApiError.resourceNotFound(`Song with id ${songId} doesn't exists`));
            return;
        }
    
        res.status(200).json({
            data: requestedSong,
        });    
    } catch (error) {
        console.error(error)
        next(ApiError.internalError("Internal error when getting songs"));
    }
    
};

const createSong = async (req, res, next) => {
    try {
        if (res.missingFieldsInBody.length > 0) {
            next(ApiError.missingFieldsInBody(res.missingFieldsInBody));
            return;
        }

        const {title, artistId, albumId, duration, url, tier, genre, description} =
            req.body;
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

const blockSong = async (req, res, next) => {
    const songId = req.params.id;

    try {
        const songToBlock = await Song.findById(songId);

        if (songToBlock === null) {
            next(ApiError.resourceNotFound(`Song with id ${songId} doesn't exists`));
            return;
        }

        await songToBlock.updateOne({disabled: true});
        res.status(204).json({});
    } catch (err) {
        next(ApiError.internalError("Internal error when trying to block song"));
        return;
    }
}

const unblockSong = async (req, res, next) => {
    const songId = req.params.id;

    try {
        const songToUnblock = await Song.findById(songId);

        if (songToUnblock === null) {
            next(ApiError.resourceNotFound(`Song with id ${songId} doesn't exists`));
            return;
        }

        await songToUnblock.updateOne({disabled: false});
        res.status(204).json({});
    } catch (err) {
        next(ApiError.internalError("Internal error when trying to block song"));
        return;
    }
}

module.exports = {
    getAllSongsByQuery,
    getSongById,
    createSong,
    unblockSong,
    blockSong
};
