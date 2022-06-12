const ApiError = require("../errors/apiError");
const Song = require("../models/songModel");
const Album = require("../models/albumModel");
const QueryParser = require('../utils/queryParser');

const getAllAlbumsByQuery = async (req, res, next) => {

    const listOfQueryKeys = ['artistId', 'tier', 'genre'];
    const queryParamsContained = ['title'];
    const queryParser = new QueryParser(listOfQueryKeys, queryParamsContained)

    const query = queryParser.parseRequest(req);

    try {
        const filteredAlbums = await Album.find(query).select("-__v");

        if (!filteredAlbums.length && Object.keys(query).length !== 0) {
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

const createAlbum = async (req, res, next) => {
    if (res.missingFieldsInBody.length > 0) {
        next(ApiError.missingFieldsInBody(res.missingFieldsInBody));
        return;
    }

    const {title, artistId, tier, genre} = req.body;

    try {
        const newAlbum = new Album({
            title: title,
            artistId: artistId,
            tier: tier,
            genre: genre
        });

        await newAlbum.save();

        res.status(201).send({})
    } catch (err) {
        next(ApiError.invalidArguments("Invalid arguments passed"));
    }
}

const createSongAndAddToAlbum = async (req, res, next) => {
    if (res.missingFieldsInBody.length > 0) {
        next(ApiError.missingFieldsInBody(res.missingFieldsInBody));
        return;
    }

    const albumId = req.params.id;
    const {title, artistId, duration, url, genre, description} = req.body;

    const requestedAlbum = await Album.findById(albumId);

    if (!requestedAlbum) {
        next(ApiError.resourceNotFound(`Album with id ${albumId} not found`));
        return;
    }

    const newSong = new Song({
        title: title,
        artistId: artistId,
        albumId: albumId,
        duration: duration,
        url: url,
        tier: requestedAlbum.tier,
        genre: genre,
        description: description,
    });
    await newSong.save();
    requestedAlbum.tracks.push(newSong);
    await requestedAlbum.save();

    res.status(201).send({})
}

module.exports = {
    getAllAlbumsByQuery,
    getAlbumById,
    createAlbum,
    createSongAndAddToAlbum
};
