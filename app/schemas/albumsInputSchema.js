const albumInputSchema = {
    'title': {'required': true},
    'artistId': {'required': true},
    'tier': {'required': true},
    'genre': {'required': true}
};

const albumEditSchema = {
    'title': {'required': false},
    'tier': {'required': false},
    'genre': {'required': false},
    'tracks': {'required': false},
}

module.exports = {
    albumInputSchema,
    albumEditSchema
};