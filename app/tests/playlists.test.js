const testingDb = require("../services/dbTesting")

const Playlist = require("../models/playlist")
const playlistRouter = require("../routes/playlistRoutes")

const errorHandlerMiddleware = require("../middleware/errorHandler")

const request = require("supertest")
const express = require("express")
const mongoose = require("mongoose")

const app = express()
app.use(express.json())
app.use(express.urlencoded())

app.use("/playlists", playlistRouter)

app.use(errorHandlerMiddleware)

beforeAll(async () => {
    await testingDb.setUpTestDb();
    await testingDb.dropTestDbCollections();
})

beforeEach(async () => {
    // Set up initial state
})

afterEach(async () => {
    await testingDb.dropTestDbCollections()
})

afterAll(async () => {
    await testingDb.dropTestDbDatabase()
})

describe("POST /playlists/", () => {
    it("Check correct creation of playlist", async () => {
        let ownerId = new mongoose.Types.ObjectId()
        const newPlaylistRequestBody = {
            title: "My testing playlist",
            description: "A playlist for testing purposes",
            ownerIds: [ownerId]
        }

        const response = await request(app).post("/playlists/")
                                           .send(newPlaylistRequestBody)

        expect(response.status).toEqual(201)
    })
})
