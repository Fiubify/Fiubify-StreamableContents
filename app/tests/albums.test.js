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
    "707f1f77bcf86cd799439011",
];

let testingAlbumsId = [];
const testingSongData = {
    title: "5",
    artistId: testingArtistsId[1],
    duration: 100,
    url: "./5",
    genre: "Folklore",
    description: "",
    tier: "Free"
}

const testAlbums = [
    {
        title: '1',
        tracks: [],
        artistId: testingArtistsId[0],
        tier: 'Free',
        genre: 'Folklore',
    },
    {
        title: '2',
        tracks: [],
        artistId: testingArtistsId[0],
        tier: 'Paid',
        genre: 'Pop'
    },
    {
        title: '3',
        tracks: [],
        artistId: testingArtistsId[1],
        tier: 'Paid',
        genre: 'Rock'
    },
    {
        title: '11',
        tracks: [],
        artistId: testingArtistsId[2],
        tier: 'Paid',
        genre: 'Rock'
    },
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
    await testingDb.dropTestDbCollections();
    testingAlbumsId = [];
    await createTestingAlbums(testAlbums);
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

    it("Check if it filter by tier", async () => {
        const response = await request(app).get("/albums/").query({tier: 'Free'});

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(1);
    });

    it("Check if it filter by genre", async () => {
        const response = await request(app).get("/albums/").query({genre: 'Rock'});

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(2);
    });

    it("Check if it filter by title", async () => {
        const response = await request(app).get("/albums/").query({title: '1'});

        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(2);
    });

    it("Check if it returns all albums when no filter is passed", async () => {
        const response = await request(app).get("/albums/");
        expect(response.status).toEqual(200);
        expect(response.body.data).toHaveLength(4);
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
            tier: "Free",
            genre: "Trap"
        });
        expect(response.status).toEqual(201);

        const secondResponse = await request(app).get("/albums/");
        expect(secondResponse.body.data).toHaveLength(5);
    });

    it("Create a new album with missing field", async () => {
        const response = await request(app).post("/albums/").send({
            title: 'someTitle',
            artistId: testingArtistsId[0],
        });
        expect(response.status).toEqual(400);

        const secondResponse = await request(app).get("/albums/");
        expect(secondResponse.body.data).toHaveLength(4);
    });
});

describe("POST /albums/:id/add-song", () => {
    it("Create a song and add to album", async () => {
        const response = await request(app).post(`/albums/${testingAlbumsId[0]}/add-song`).send(testingSongData);

        expect(response.status).toEqual(201);

        const updatedAlbumResponse = await request(app).get(`/albums/${testingAlbumsId[0]}`);
        expect(updatedAlbumResponse.body.data.tracks).toHaveLength(1);
    })

    it("Create a song with missing fields and add to album", async () => {
        let testingSongDataWithoutField = Object.assign(testingSongData);
        testingSongDataWithoutField.duration = undefined;
        const response = await request(app).post(`/albums/${testingAlbumsId[0]}/add-song`).send(testingSongDataWithoutField);

        expect(response.status).toEqual(400);

        const updatedAlbumResponse = await request(app).get(`/albums/${testingAlbumsId[0]}`);
        expect(updatedAlbumResponse.body.data.tracks).toHaveLength(0);
    })
});

describe("PUT /albums/:id", () => {
    it("Update properties of album but no track changes", async () => {
        const newAlbumContent = {"genre": "testGenre", "description": "testDescription"}
        const response = await request(app).put(`/albums/${testingAlbumsId[0]}`).send(newAlbumContent);

        expect(response.status).toEqual(204);

        const updatedAlbumResponse = await request(app).get(`/albums/${testingAlbumsId[0]}`);
        expect(updatedAlbumResponse.body.data.description).toEqual(undefined);
        expect(updatedAlbumResponse.body.data.genre).toEqual(newAlbumContent.genre);
    });
})