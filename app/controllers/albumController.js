const ApiError = require("../errors/apiError");
const QueryParser = require('../utils/queryParser');

const Song = require("../models/songModel");
const Album = require("../models/albumModel");
const Playlist = require("../models/playlistModel");
const Favourite = require("../models/favouritesModel");


const getAllAlbumsByQuery = async (req, res, next) => {
    try {
        const listOfQueryKeys = ['artistId', 'tier', 'genre'];
        const queryParamsContained = ['title'];
        const queryParser = new QueryParser(listOfQueryKeys, queryParamsContained)

        const query = queryParser.parseRequest(req);


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
    try {
        const albumId = req.params.id;

        const requestedAlbum = await Album.findById(albumId).select("-_id -__v");

        if (requestedAlbum == null) {
            next(ApiError.resourceNotFound(`Album with id ${albumId} doesn't exists`));
            return;
        }

        res.status(200).json({
            data: requestedAlbum,
        });
    } catch (err) {
        console.log(err);
        next(ApiError.internalError("Internal error when getting albums"));

    }

};

const createAlbum = async (req, res, next) => {
    try {
        if (res.missingFieldsInBody.length > 0) {
            next(ApiError.missingFieldsInBody(res.missingFieldsInBody));
            return;
        }

        const {title, artistId, tier, genre} = req.body;

        const newAlbum = new Album({
            title: title,
            artistId: artistId,
            tier: tier,
            genre: genre
        });

        await newAlbum.save();

        res.status(201).send({})
    } catch (err) {
        console.log(err)
        next(ApiError.invalidArguments("Invalid arguments passed"));
    }
}

const createSongAndAddToAlbum = async (req, res, next) => {
    try {
        if (res.missingFieldsInBody.length > 0) {
            next(ApiError.missingFieldsInBody(res.missingFieldsInBody));
            return;
        }

        const albumId = req.params.id;
        const {title, artistId, duration, url, genre, description, tier} = req.body;

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
            tier: tier,
            genre: genre,
            description: description,
        });

        const newSongWithId = await newSong.save();
        requestedAlbum.tracks.push(newSongWithId);
        await requestedAlbum.save();

        res.status(201).send({})
    } catch (err) {
        console.log(err)
        next(ApiError.invalidArguments("Invalid arguments passed"));
    }

}

const deleteForeignKeys = async (listOfIds) => {

    for (const id of listOfIds) {
        await Playlist.updateMany({tracks: {$in: {_id: id}}}, {$pullAll: {_id: id}})
        await Favourite.updateMany({tracks: {$in: {_id: id}}}, {$pullAll: {_id: id}})
    }

}

const editAlbum = async (req, res, next) => {
    const albumId = req.params.id;

    try {

        if (res.missingFieldsInBody.length > 0) {
            next(ApiError.missingFieldsInBody(res.missingFieldsInBody));
            return;
        }

        const {tracks} = req.body;

        const albumToEdit = await Album.findOne({"id": albumId}).exec();

        if (albumToEdit === null) {
            next(ApiError.resourceNotFound(`Album with ${albumId} not found`))
            return;
        }

        // Update to the albums tracks
        let songsToDelete = [];
        if (tracks) {
            const albumSongsId = albumToEdit.tracks.map((track) => track._id);
            songsToDelete = albumSongsId.filter(x => !tracks.includes(x));
            albumToEdit.tracks.map((song) => {
                if (songsToDelete.includes(song._id)) {
                    song.remove();
                }
            });

            delete req.body.tracks;
        }


        // Update to the album values
        Object.assign(albumToEdit, req.body);
        console.log(albumToEdit.genre)
        await albumToEdit.save();

        // Delete dependencies of deleted songs
        if (songsToDelete) {
            await deleteForeignKeys(songsToDelete);
        }

        res.status(204).send({})
    } catch (err) {
        console.log(err);
        next(ApiError.internalError(`Error trying to update album with ${albumId}`));
        return;
    }
}

const deleteAlbum = async (req, res, next) => {
    const albumId = req.params.id
    try {

        const albumToDelete = await Album.findOne({"id": albumId});
        if (albumToDelete === null) {
            next(ApiError.resourceNotFound(`Album with ${albumId} not found`))
            return;
        }

        const listOfDependencies = await albumToDelete.tracks.map((track => track._id));

        for (const song in albumToDelete.tracks) {
            await song.remove();
        }
        await albumToDelete.remove()

        await deleteForeignKeys(listOfDependencies);
        res.status(204).json({});
    } catch (err) {
        console.log(err);
        next(ApiError.internalError(`Error trying to delete album with ${albumId}`));
        return;
    }
}

module.exports = {
    getAllAlbumsByQuery,
    getAlbumById,
    createAlbum,
    createSongAndAddToAlbum,
    deleteAlbum,
    editAlbum
};
