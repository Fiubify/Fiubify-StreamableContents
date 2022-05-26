const Playlist = require("../models/playlist")
const ApiError = require("../errors/apiError");

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
    next(ApiError.invalidArguments(`Invalid arguments passed`));
    return
  }
}

const getPlaylistWithTracks = async (req, res, next) => {

}

module.exports = {
  createPlaylist,
}