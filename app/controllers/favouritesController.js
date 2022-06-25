const Favourites = require("../models/favouritesModel");
const ApiError = require("../errors/apiError")

async function fetchFavourites(uid) {
    const userFavourites = await Favourites.findOne({"uid": uid});
    if (userFavourites == null) {
        const newFav = new Favourites({
            uid: uid,
        });
        await newFav.save();
        return [];
    } else {
        userFavourites.populate('tracks');
        return userFavourites.tracks;
    }
}

const getAllFavouritesSongs = async (req, res, next) => {
    const userUid = req.params.uid;

    try {
        const tracks = await fetchFavourites(userUid);
        res.status(200).json({data: tracks});
    } catch (error) {
        console.log(error);
        next(ApiError.internalError(`Internal error when getting favourites for user ${userUid}`));
    }

}

const addSongToFavourites = async (req, res, next) => {
    if (res.missingFieldsInBody.length > 0) {
        next(ApiError.missingFieldsInBody(res.missingFieldsInBody));
        return;
    }

    const userUid = req.params.uid;
    const {songId} = req.body;

    try {
        const tracks = await fetchFavourites(userUid);
        if (!(await tracks).includes(songId)) {
            await Favourites.findOneAndUpdate({"uid": userUid}, {$push: {"tracks": songId}}, {"upsert": true});
        }
        res.status(201).json({});
    } catch (error) {
        console.log(error);
        next(ApiError.internalError(`Internal error when adding song ${songId} on favourites of user ${userUid}`));
        return;
    }

};

const removeSongFromFavourites = async (req, res, next) => {
    if (res.missingFieldsInBody.length > 0) {
        next(ApiError.missingFieldsInBody(res.missingFieldsInBody));
        return;
    }

    const userUid = req.params.uid;
    const {songId} = req.body;

    try {
        await Favourites.findOneAndUpdate({"uid": userUid}, {$pull: {"tracks": songId}});
        res.status(204).json({});
    } catch (error) {
        next(ApiError.internalError(`Internal error when removing song ${songId} on favourites of user ${userUid}`));
        return;
    }
}

module.exports = {
    getAllFavouritesSongs,
    addSongToFavourites,
    removeSongFromFavourites
}