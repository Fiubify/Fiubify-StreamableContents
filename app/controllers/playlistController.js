const Playlist = require("../models/playlist")
const ApiError = require("../errors/apiError")
const QueryParser = require('../utils/queryParser')

const createPlaylist = async (req, res, next) => {
    const {title, description, ownerIds, collaborative} = req.body

    try {
        const newPlaylist = new Playlist({
            title: title,
            description: description,
            ownerIds: ownerIds,
            collaborative: collaborative
        })

        await newPlaylist.save()

        res.status(201).send({})
    } catch (error) {
        next(ApiError.invalidArguments(`Invalid arguments passed`))
    }
}

const getPlaylists = async (req, res, next) => {
    const queryParamsContained = ['title', 'owners']
    const queryParser = new QueryParser([], queryParamsContained);
    const query = queryParser.parseRequest(req);

    try {
        const filteredPlaylists = await Playlist.find(query)
        if (!filteredPlaylists.length && Object.keys(query).length !== 0) {
            const message = queryParser.getErrorMessageNotFound(req)
            next(ApiError.resourceNotFound(message))
            return
        } else {
            res.status(200).json({data: filteredPlaylists})
        }
    } catch (error) {
        next(ApiError.internalError("Internal error when getting playlists"))
    }
}

const getPlaylist = async (req, res, next) => {
    const playlistId = req.params.id
    const requestedPlaylist = await Playlist.findById(playlistId)
                                            .populate('tracks')
    if (requestedPlaylist == null) {
        next(ApiError.resourceNotFound(`Playlist with id ${playlistId} doesn't exist`))
        return
    }

    res.status(200).json({data: requestedPlaylist})
}

module.exports = {
    getPlaylists,
    getPlaylist,
    createPlaylist,
}