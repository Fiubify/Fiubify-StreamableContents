const songInputSchema = {
    'title': {'required': true},
    'artistId': {'required': true},
    'albumId': {'required': true},
    'duration': {'required': true},
    'url': {'required': true},
    'tier': {'required': true},
    'genre': {'required': true},
    'description': {}
}

const songIntoAlbumInputSchema = {
    'title': {'required': true},
    'artistId': {'required': true},
    'duration': {'required': true},
    'url': {'required': true},
    'genre': {'required': true},
    'description': {}
}

module.exports = {
    songInputSchema,
    songIntoAlbumInputSchema
};