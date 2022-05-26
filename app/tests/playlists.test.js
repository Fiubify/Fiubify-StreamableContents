const testingDb = require("../services/dbTesting")

const Song = require("../models/songModel")

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

const createTestTrack = async () => {
    const song = {
        title: "Cherokee",
        artistId: mongoose.Types.ObjectId(),
        albumId: mongoose.Types.ObjectId(),
        duration: 374,
        url: "./cherokee",
        tier: "Free",
        genre: "Jazz",
        description: "",
    }
    const newSong = new Song(song)
    await newSong.save()

    return newSong.id
}

const owner1 = {
    name: "Juan Perez",
    id: mongoose.Types.ObjectId().toString()
}

const owner2 = {
    name: "Francisca Sanchez",
    id: mongoose.Types.ObjectId().toString()
}

const owner3 = {
    name: "Emiliano Sanchez",
    id: mongoose.Types.ObjectId().toString()
}

let testingPlaylistsIds = []
const createTestingPlaylists = async (playlists) => {
    for (const playlist of playlists) {
        const newPlaylist = new Playlist(playlist)
        await newPlaylist.save()
        testingPlaylistsIds.push(newPlaylist.id)
    }
}

beforeAll(async () => {
    await testingDb.setUpTestDb();
    await testingDb.dropTestDbCollections();
})

beforeEach(async () => {
    const trackId = await createTestTrack()

    const testingPlaylists = [
        {
            title: "Jazz playlist",
            description: "Our favorite jazz songs",
            owners: [owner1, owner2],
            collaborative: false,
            tracks: [trackId]
        },
        {
            title: "Rock music",
            description: "A playlist full of rock music",
            owners: [owner1],
            collaborative: true,
            tracks: []
        },
        {
            title: "Empty playlist",
            description: "An empty playlist I made",
            owners: [owner3],
            collaborative: false,
            tracks: []
        }
    ]
    await createTestingPlaylists(testingPlaylists)
})

afterEach(async () => {
    await testingDb.dropTestDbCollections()
    testingPlaylistsIds = []
})

afterAll(async () => {
    await testingDb.dropTestDbDatabase()
})

describe("POST /playlists/", () => {

    it("Correctly creates playlist", async () => {
        let owner = {
            name: "Antonio Ramirez",
            id: new mongoose.Types.ObjectId()
        }

        const newPlaylistRequestBody = {
            title: "My testing playlist",
            description: "A playlist for testing purposes",
            owners: [owner]
        }

        const response = await request(app).post("/playlists/")
                                           .send(newPlaylistRequestBody)

        expect(response.status).toEqual(201)
    })

})

describe("GET /playlists/", () => {

    it("Returns all playlists when no filter has been passed", async () => {
        const response = await request(app).get("/playlists/")
        expect(response.status).toEqual(200)
        expect(response.body.data).toHaveLength(3)
    })

})

describe("GET /playlists/:id", () => {

    it("Returns playlist", async () => {
        const response = await request(app).get(`/playlists/${testingPlaylistsIds[0]}`)
        expect(response.status).toEqual(200)

        expect(response.body.data.title).toEqual('Jazz playlist')
        expect(response.body.data.description).toEqual('Our favorite jazz songs')
        expect(response.body.data.collaborative).toEqual(false)
        expect(response.body.data.owners).toHaveLength(2)
        expect(response.body.data.tracks).toHaveLength(1)
        expect(response.body.data.tracks[0].title).toEqual('Cherokee')
    })

})
