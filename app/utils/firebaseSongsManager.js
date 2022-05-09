class FirebaseSongsManager {
    constructor(firebaseStorage) {
        this.firebaseStorage = firebaseStorage
    }

    createSongUploader(multerFile, title, albumId, artistId) {
        const fileName = `${artistId}/${albumId}/${title}`;
        return new FirebaseSongUploader(multerFile, fileName, this.firebaseStorage)
    }
}

class FirebaseSongUploader {
    constructor(multerFile, fileName, firebaseStorage) {
        this.fileName = fileName
        this.firebaseStorage = firebaseStorage
        this.blob = firebaseStorage.file(fileName);
        this.blobWriteStream = this.blob.createWriteStream({
            metadata: {
                contentType: multerFile.mimetype
            }
        });
    }

    setUpInputPipe(readStream) {
        readStream.pipe(this.blobWriteStream);
    }

    getFilePublicUrl() {
        return `https://firebasestorage.googleapis.com/v0/b/${this.firebaseStorage.name}/o/${encodeURI(this.blob.name)}?alt=media`;
    }

    getFileName() {
        return this.fileName
    }

    setUpErrorEvent(callback) {
        this.blobWriteStream.on('error', callback)
    }

    setUpFinishEvent(callback) {
        this.blobWriteStream.on('finish', callback);
    }
}

module.exports = {
    FirebaseSongsManager
}