const Playlist = require("../models/playlistModel")
const ApiError = require("../errors/apiError")
const QueryParser = require('../utils/queryParser')

const createPlaylist = async (req, res, next) => {
    const {title, description, owners, collaborative} = req.body

    try {
        const newPlaylist = new Playlist({
            title: title,
            description: description,
            owners: owners,
            collaborative: collaborative
        })

        await newPlaylist.save()

        res.status(201).send({})
    } catch (error) {
        next(ApiError.invalidArguments(`Invalid arguments passed`))
    }
}

const getPlaylists = async (req, res, next) => {
    try {
        const queryParamsSubset = ['owners.id']
        const queryParamsContained = ['title']
        const queryParser = new QueryParser(queryParamsSubset, queryParamsContained)

        const query = queryParser.parseRequest(req);

        const filteredPlaylists = await Playlist.find(query);
        if (!filteredPlaylists.length && Object.keys(query).length !== 0) {
            const message = queryParser.getErrorMessageNotFound(req)
            next(ApiError.resourceNotFound(message))
        } else {
            res.status(200).json({data: filteredPlaylists})
        }
    } catch (error) {
        next(ApiError.internalError(`Internal error when getting playlists: ${error}`))
    }
}

const getPlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.id
        const requestedPlaylist = await Playlist.findById(playlistId);
        await requestedPlaylist.populate('tracks');
        if (requestedPlaylist == null) {
            next(ApiError.resourceNotFound(`Playlist with id ${playlistId} doesn't exist`))
            return
        }

        res.status(200).json({data: requestedPlaylist})
    } catch (error) {
        console.error(error)
        next(ApiError.internalError("HAGAN LOS CATCH"))
    }

}

const editPlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.id

        let requestedPlaylist = await Playlist.findById(playlistId)
        if (!requestedPlaylist) {
            next(ApiError.resourceNotFound(`Playlist with id ${playlistId} doesn't exist`))
            return
        }
    
        Object.assign(requestedPlaylist, req.body)
        await requestedPlaylist.save()
        res.status(204).send({})    
    } catch (error) {
        console.error(error)
        next(ApiError.internalError("HAGAN LOS CATCH"))
    }
    
}

const addTrackToPlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.id
        const trackId = req.body.trackId
    
        const requestedPlaylist = await Playlist.findById(playlistId)
        if (!requestedPlaylist) {
            next(ApiError.resourceNotFound(`Playlist with id ${playlistId} doesn't exist`))
            return
        }
    
        requestedPlaylist.tracks.push(trackId)
        await requestedPlaylist.save()
        res.status(204).send({})    
    } catch (error) {
        console.error(error)
        next(ApiError.internalError("HAGAN LOS CATCH"))
    }
    
}

const removeTrackFromPlaylist = async (req, res, next) => {
    try {
        const playlistId = req.params.id
        const trackId = req.body.trackId
    
        let requestedPlaylist = await Playlist.findById(playlistId)
        if (!requestedPlaylist) {
            next(ApiError.resourceNotFound(`Playlist with id ${playlistId} doesn't exist`))
            return
        }
    
        requestedPlaylist.tracks = requestedPlaylist.tracks.filter(track => track._id !== trackId)
        await requestedPlaylist.save()
        res.status(204).send({})    
    } catch (error) {
        console.error(error)
        next(ApiError.internalError("HAGAN LOS CATCH"))
    }
    
}

module.exports = {
    createPlaylist,
    getPlaylists,
    getPlaylist,
    editPlaylist,
    addTrackToPlaylist,
    removeTrackFromPlaylist,
}
