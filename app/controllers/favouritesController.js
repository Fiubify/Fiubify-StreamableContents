const Favourites = require("../models/favouritesModel");
const ApiError = require("../errors/apiError")

const getAllFavouritesSongs = async (req, res, next) => {
    const userUid = req.params.uid;

    try {
        const userFavourites = await Favourites.findOne({"uid": userUid});
        if (userFavourites == null) {
            const newFav = new Favourites({
                uid: userUid,
            });
            await newFav.save();
            res.status(200).json({data: []})
        } else {
            userFavourites.populate('tracks')
            res.status(200).json({data: userFavourites.tracks});
        }
    } catch (error) {
        console.log(error);
        next(ApiError.internalError(`Internal error when getting favourites for user ${userUid}`));
        return;
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
        await Favourites.findOneAndUpdate({"uid": userUid}, {$push: {"tracks": songId}}, {"upsert": true});
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