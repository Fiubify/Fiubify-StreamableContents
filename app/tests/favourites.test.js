const testingDb = require("../services/dbTesting");
const Song = require("../models/songModel")
const Favourite = require("../models/favouritesModel");
const favouriteRouter = require("../routes/favouriteRoutes");
const errorHandlerMiddleware = require("../middleware/errorHandler");

const request = require("supertest");
const express = require("express");

const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use("/favourites", favouriteRouter);

app.use(errorHandlerMiddleware);

let testingFavouritesIds = [];

const testingUsersUId = [
    "517f1f77bcf86cd799439011",
    "617f1f77bcf86cd799439011",
    "717f1f77bcf86cd799439011",
];

const testingArtistsId = [
    "507f1f77bcf86cd799439011",
    "607f1f77bcf86cd799439011",
    "707f1f77bcf86cd799439011",
];

const testingAlbumsId = [
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013",
    "507f1f77bcf86cd799439010",
    "507f1f77bcf86cd799439014",
];


// const testingArtistsId = [mongoose.Types.ObjectId(), mongoose.Types.ObjectId(), mongoose.Types.ObjectId()];
// let testingAlbumsId = [mongoose.Types.ObjectId(), mongoose.Types.ObjectId(), mongoose.Types.ObjectId()];
//const testingUsersUId = [mongoose.Types.ObjectId(), mongoose.Types.ObjectId(), mongoose.Types.ObjectId()];

let testingSongsId = [];
const testingSongData = [{
    title: "1",
    artistId: testingArtistsId[0],
    albumId: testingAlbumsId[0],
    duration: 100,
    url: "./1",
    genre: "Folklore",
    description: "",
    tier: "Free"
}, {
    title: "2",
    artistId: testingArtistsId[1],
    albumId: testingAlbumsId[1],
    duration: 100,
    url: "./2",
    genre: "Pop",
    description: "",
    tier: "Free"
}, {
    title: "3",
    artistId: testingArtistsId[1],
    albumId: testingAlbumsId[0],
    duration: 100,
    url: "./3",
    genre: "Trap",
    description: "",
    tier: "Free"
},]

const createTestTrack = async (track) => {
    const newSong = new Song(track);
    await newSong.save();

    testingSongsId.push(newSong.id);
    return newSong.id;
}

const createTestingFavourites = async (favourites) => {
    for (const favourite of favourites) {
        const newFavourite = new Favourite(favourite);
        await newFavourite.save();
        testingFavouritesIds.push(newFavourite.id)
    }
};

beforeAll(async () => {
    await testingDb.setUpTestDb();
    await testingDb.dropTestDbCollections();
});

beforeEach(async () => {
    await testingDb.dropTestDbCollections();
    testingFavouritesIds = [];
    testingSongsId = [];

    for (const testSong of testingSongData) {
        await createTestTrack(testSong);
    }

    const testFavourites = [{
        uid: testingUsersUId[0], tracks: [testingSongsId[0]],
    }, {
        uid: testingUsersUId[1], tracks: [testingSongsId[1], testingSongsId[2]],
    }, {
        uid: testingUsersUId[2], tracks: [],
    },];
    await createTestingFavourites(testFavourites);
});

afterAll(async () => {
    await testingDb.dropTestDbDatabase();
});

describe("GET /favourites/:uid", () => {
    it("Check it gets the correct favourites", async () => {
        const response = await request(app).get(`/favourites/${testingUsersUId[0]}`);
        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(1);
    });

    it("Check favourites empty creation when passing non existen id", async () => {
        const response = await request(app).get(`/favourites/527f1f77bcf86cd799439012`)
        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(0);
    });
});

describe("POST /favourites/:uid/add-song", () => {

    it("Adds track to favourite's track", async () => {
        let track = {
            title: "There Will Never Be Another You",
            artistId: testingArtistsId[0],
            albumId: testingAlbumsId[0],
            duration: 374,
            url: "./there-will-never-be-another-you",
            tier: "Free",
            genre: "Jazz",
            description: "",
        }
        const trackId = await createTestTrack(track);

        const response = await request(app).post(`/favourites/${testingUsersUId[2]}/add-song`)
            .send({songId: trackId})

        expect(response.status).toEqual(201);

        const response2 = await request(app).get(`/favourites/${testingUsersUId[2]}`);
        expect(response2.status).toEqual(200);
        expect(response2.body.data).toHaveLength(1);
        expect(response2.body.data[0]).toEqual(trackId);
    })

    it("Add track 2 times to favourite's track only adds 1 time", async () => {
        let track = {
            title: "There Will Never Be Another You",
            artistId: testingArtistsId[0],
            albumId: testingAlbumsId[0],
            duration: 374,
            url: "./there-will-never-be-another-you",
            tier: "Free",
            genre: "Jazz",
            description: "",
        }
        const trackId = await createTestTrack(track);

        const response = await request(app).post(`/favourites/${testingUsersUId[2]}/add-song`)
            .send({songId: trackId})

        expect(response.status).toEqual(201);

        const response2 = await request(app).get(`/favourites/${testingUsersUId[2]}`);
        expect(response2.status).toEqual(200);
        expect(response2.body.data).toHaveLength(1);

        const response3 = await request(app).post(`/favourites/${testingUsersUId[2]}/add-song`)
            .send({songId: trackId})

        expect(response3.status).toEqual(201);

        const response4 = await request(app).get(`/favourites/${testingUsersUId[2]}`);
        expect(response4.status).toEqual(200);
        expect(response4.body.data).toHaveLength(1);
    })
})

describe("DELETE /favourites/:uid/remove-song", () => {

    it("Adds track to favourite's track", async () => {
        const response = await request(app).get(`/favourites/${testingUsersUId[1]}`);
        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(2);

        const response2 = await request(app).delete(`/favourites/${testingUsersUId[1]}/remove-song`)
            .send({songId: response.body.data[0]})

        expect(response2.status).toEqual(204);

        const response3 = await request(app).get(`/favourites/${testingUsersUId[1]}`);
        expect(response3.status).toEqual(200);
        expect(response3.body.data).toHaveLength(1);
        expect(response3.body.data[0]).toEqual(response.body.data[1]);
    })
})