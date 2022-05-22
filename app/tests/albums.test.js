const testingDb = require("../services/dbTesting");
const Album = require("../models/albumModel");
const albumRouter = require("../routes/albumRoutes");
const errorHandlerMiddleware = require("../middleware/errorHandler");

const request = require("supertest");
const express = require("express");


const app = express();
app.use(express.json());
app.use(express.urlencoded());
app.use("/albums", albumRouter);

app.use(errorHandlerMiddleware);

const testingArtistsId = [
    "507f1f77bcf86cd799439011",
    "607f1f77bcf86cd799439011",
];

let testingAlbumsId = [];

const testAlbums = [
    {
        title: '1',
        tracks: [],
        artistId: testingArtistsId[0],
        tier: 'Free'
    },
    {
        title: '2',
        tracks: [],
        artistId: testingArtistsId[0],
        tier: 'Paid'
    },
    {
        title: '3',
        tracks: [],
        artistId: testingArtistsId[1],
        tier: 'Paid'
    }
];

const createTestingAlbums = async (albums) => {
    for (const album of albums) {
        const newAlbum = new Album(album);
        await newAlbum.save();
        testingAlbumsId.push(newAlbum.id);
    }
};

beforeAll(async () => {
    await testingDb.setUpTestDb();
    await testingDb.dropTestDbCollections();
});

beforeEach(async () => {
    await createTestingAlbums(testAlbums);
});

afterEach(async () => {
    await testingDb.dropTestDbCollections();
    testingAlbumsId = [];
});

afterAll(async () => {
    await testingDb.dropTestDbDatabase();
});

describe("GET /albums/", () => {
    it("Check if it filter by artistId", async () => {
        const response = await request(app).get("/albums/").query({artistId: testingArtistsId[0]});

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(2);
    });

    it("Check if it filter by genre", async () => {
        const response = await request(app).get("/albums/").query({tier: 'Free'});

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(1);
    });

    it("Check if it returns all songs when no filter is passed", async () => {
        const response = await request(app).get("/albums/");
        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(3);
    });

    it("Check it returns an error with wrong filter", async () => {
        const response = await request(app).get('/albums/').query({tier: 'Pin'});
        expect(response.status).toEqual(404);
    })
});

describe("GET /albums/:id", () => {
    it("Check it gets the correct song", async () => {
        const response = await request(app).get(`/albums/${testingAlbumsId[0]}`);
        expect(response.status).toEqual(200);
        expect(response.body.data).toEqual(testAlbums[0])
    });

    it("Check error when passing non existen id", async () => {
        const response = await request(app).get(`/albums/527f1f77bcf86cd799439012`)
        expect(response.status).toEqual(404);
    });
});

describe("POST /albums/", () => {
    it("Create a new album", async () => {
        const response = await request(app).post("/albums/").send({
            title: 'someTitle',
            artistId: testingArtistsId[0],
            tier: "Free"
        });


        const secondResponse = await request(app).get("/albums/");
        expect(response.status).toEqual(201);
        expect(secondResponse.body.data).toHaveLength(4);
    })
})