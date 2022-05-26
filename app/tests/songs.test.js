const testingDb = require("../services/dbTesting");
const Song = require("../models/songModel");
const songRouter = require("../routes/songRoutes");
const errorHandlerMiddleware = require("../middleware/errorHandler");

const request = require("supertest");
const express = require("express");


const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use("/songs", songRouter);

app.use(errorHandlerMiddleware);

// 3 with the same artist 2/3 with same album;
// 1 with different artist
// 2 with the same genre, the others with different (2)
// 4 with the same tier

const testingArtistsId = [
    "507f1f77bcf86cd799439011",
    "607f1f77bcf86cd799439011",
];

const testingAlbumId = [
    "507f1f77bcf86cd799439012",
    "507f1f77bcf86cd799439013",
    "507f1f77bcf86cd799439010",
];

const testingSongs = [
    {
        title: "1",
        artistId: testingArtistsId[0],
        albumId: testingAlbumId[0],
        duration: 100,
        url: "./1",
        tier: "Free",
        genre: "Electronic",
        description: "",
    },
    {
        title: "2",
        artistId: testingArtistsId[0],
        albumId: testingAlbumId[0],
        duration: 100,
        url: "./2",
        tier: "Free",
        genre: "Pop",
        description: "",
    },
    {
        title: "3",
        artistId: testingArtistsId[0],
        albumId: testingAlbumId[1],
        duration: 100,
        url: "./3",
        tier: "Free",
        genre: "Pop",
        description: "",
    },
    {
        title: "4",
        artistId: testingArtistsId[1],
        albumId: testingAlbumId[2],
        duration: 100,
        url: "./4",
        tier: "Free",
        genre: "Folklore",
        description: "",
    },
];

const newSongToAddTest = {
    title: "5",
    artistId: testingArtistsId[1],
    albumId: testingAlbumId[2],
    duration: 100,
    url: "./5",
    tier: "Free",
    genre: "Folklore",
    description: "",
}

let testingSongsId = []

const createTestingSongs = async (songs) => {
    for (const song of songs) {
        const newSong = new Song(song);
        await newSong.save();
        testingSongsId.push(newSong.id);
    }
};

beforeAll(async () => {
    await testingDb.setUpTestDb();
    await testingDb.dropTestDbCollections();
});

beforeEach(async () => {
    await createTestingSongs(testingSongs);
});

afterEach(async () => {
    await testingDb.dropTestDbCollections();
    testingSongsId = [];
});

afterAll(async () => {
    await testingDb.dropTestDbDatabase();
});

describe("GET /songs/", () => {
    it("Check if it filter by artistId", async () => {
        const response = await request(app).get("/songs/").query({artistId: testingArtistsId[0]});

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(3);
    });

    it("Check if it filter by albumId", async () => {
        const response = await request(app).get("/songs/").query({albumId: testingAlbumId[1]});

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(1);
    });

    it("Check if it filter by genre", async () => {
        const response = await request(app).get("/songs/").query({genre: 'Pop'});

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(2);
    });

    it("Check if it returns all songs when no filter is passed", async () => {
        const response = await request(app).get("/songs/");
        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(4);
    });

    it("Check it returns an error with wrong filter", async () => {
        const response = await request(app).get('/songs/').query({genre: 'Pin'});
        expect(response.status).toEqual(404);
    })
});

describe("GET /songs/:id", () => {
    it("Check it gets the correct song", async () => {
        const response = await request(app).get(`/songs/${testingSongsId[0]}`);
        expect(response.status).toEqual(200);
        expect(response.body.data).toEqual(testingSongs[0])
    });

    it("Check error when passing non existen id", async () => {
        const response = await request(app).get(`/songs/527f1f77bcf86cd799439012`)
        expect(response.status).toEqual(404);
    });
});



describe("POST /songs/", () => {
    it("Check correct creation of song", async () => {
        const response = await request(app).post("/songs/").send(newSongToAddTest);
        expect(response.status).toEqual(201);

        const secondResponse = await request(app).get("/songs/")
        expect(secondResponse.body.data).toHaveLength(5);
    })
});

