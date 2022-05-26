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
  } catch (error) {
    next(ApiError.invalidArguments(`Invalid arguments passed`));
    return
  }
}
