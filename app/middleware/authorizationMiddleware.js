const axios = require("axios");

const ApiError = require("../errors/apiError");

const Song = require("../models/songModel");
const Album = require("../models/albumModel");
const Playlist = require("../models/playlistModel");

//TODO WARNING Change hardcoded path
const validateUserWithToken = async (token, artistId) => {
    const response = await axios.post("https://fiubify-users-staging.herokuapp.com/validate/user", {
        token: token,
        userId: artistId
    });

    return response
};

const validateMultipleUsersWithToken = async (token, arrayOfownersId) => {
    const response = await axios.post("https://fiubify-users-staging.herokuapp.com/validate/user", {
        token: token,
        usersId: arrayOfownersId
    });

    return response
}


const protectUrlBySongOwner = async (req, res, next) => {
    const songId = req.params.id;
    const token = req.body.token;

    const song = await Song.findById(songId);
    if (!song) {
        ApiError.resourceNotFound(`Song with id ${songId} doesn't exists`).constructResponse(res);
        return;
    }

    const userValidationResult = await validateUserWithToken(token, song.artistId);
    if (userValidationResult.status !== 200) {
        ApiError.forbiddenError(`User isn't owner of song with id: ${songId}`).constructResponse(res);
    } else {
        next();
    }
};

const protectUrlByAlbumOwner = async (req, res, next) => {
    const albumId = req.params.id;
    const token = req.body.token;

    const album = await Album.findById(albumId);
    if (!album) {
        ApiError.resourceNotFound(`Album with id ${albumId} doesn't exists`).constructResponse(res);
        return;
    }

    const userValidationResult = await validateUserWithToken(token, album.artistId);
    if (userValidationResult.status !== 200) {
        ApiError.forbiddenError(`User isn't owner of album with id: ${albumId}`).constructResponse(res);
    } else {
        next();
    }
};

const protectUrlByPlaylistOwner = async (req, res, next) => {
    const playlistId = req.params.id;
    const token = req.body.token;

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) {
        ApiError.resourceNotFound(`Playlist with id ${playlistId} doesn't exists`).constructResponse(res);
        return;
    }

    if (!playlist.collaborative) {
        const usersValidationResult = await validateMultipleUsersWithToken(token, playlist.owners.map(owner => owner.id));
        if (usersValidationResult.status !== 200) {
            ApiError.forbiddenError(`User isn't owner of album with id: ${playlistId}`).constructResponse(res);
            return;
        }
    }

    next();
}

module.exports = {
    protectUrlBySongOwner,
    protectUrlByAlbumOwner,
    protectUrlByPlaylistOwner
}