const axios = require("axios");

const ApiError = require("../errors/apiError");
const InternalServicesUrls = require("../services/internalServicesAPI");

const Song = require("../models/songModel");
const Album = require("../models/albumModel");
const Playlist = require("../models/playlistModel");

const validateUserUidWithToken = async (token, uid) => {
    try {
        const response = await axios.post(InternalServicesUrls.uidAuthValidationUrl, {
            token: token,
            uid: uid
        });

        return response
    } catch (e) {
        return e
    }
}


const validateUserWithToken = async (token, artistId) => {
    const response = await axios.post(InternalServicesUrls.userAuthValidationUrl, {
        token: token,
        userId: artistId
    });

    return response
};

const validateMultipleUsersWithToken = async (token, arrayOfownersId) => {
    const response = await axios.post(InternalServicesUrls.userAuthValidationUrl, {
        token: token,
        usersId: arrayOfownersId
    });

    return response
}

const protectUrlByUid = async (req, res, next) => {
    const uid = req.params.uid;
    const {token} = req.body.token;

    const validation = await validateUserUidWithToken(token, uid);
    if (validation.status !== 200) {
        if (validation.status === 403) {
            return ApiError.forbiddenError(`User token doesn't belong to sent uid`);
        } else if (validation.status === 400) {
            return ApiError.invalidArguments('Invalid uid passed')
        } else {
            return ApiError.internalError('Error with auth')
        }

    } else {
        next();
    }
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

    const userValidationResult = await validateUserUidWithToken(token, album.artistId);
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

    const usersValidationResult = await validateMultipleUsersWithToken(token, playlist.owners.map(owner => owner.id));
    if (usersValidationResult.status !== 200) {
        ApiError.forbiddenError(`User isn't owner of album with id: ${playlistId}`).constructResponse(res);
    } else {
        next();
    }
}

module.exports = {
    protectUrlByUid,
    protectUrlBySongOwner,
    protectUrlByAlbumOwner,
    protectUrlByPlaylistOwner
}