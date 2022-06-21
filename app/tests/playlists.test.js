const testingDb = require("../services/dbTesting")

const Song = require("../models/songModel")

const Playlist = require("../models/playlistModel")
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

const createTestTrack = async (track) => {
    const newSong = new Song(track)
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
    await testingDb.dropTestDbCollections()
    testingPlaylistsIds = []

    const testTrack = {
        title: "Cherokee",
        artistId: mongoose.Types.ObjectId(),
        albumId: mongoose.Types.ObjectId(),
        duration: 374,
        url: "./cherokee",
        tier: "Free",
        genre: "Jazz",
        description: "",
    }
    const trackId = await createTestTrack(testTrack)

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

    it("Filters by owner ID", async () => {
        const response = await request(app).get("/playlists/").query({'owners.id': owner1.id})

        expect(response.status).toEqual(200)
        expect(response.body.data).toHaveLength(2)
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

describe("POST /playlists/:id/edit", () => {

    it("Successfully edits playlist", async () => {
        const request_body = {
            title: "Jazzy",
            description: "An open jazz playlist",
            owners: [owner1],
            collaborative: true
        }

        const response = await request(app).post(`/playlists/${testingPlaylistsIds[0]}/edit`)
            .send(request_body)

        const playlist = await Playlist.findById(testingPlaylistsIds[0])

        expect(response.status).toEqual(204)
        expect(playlist.title).toEqual('Jazzy')
        expect(playlist.description).toEqual('An open jazz playlist')
        expect(playlist.owners).toHaveLength(1)
        expect(playlist.collaborative).toEqual(true)
    })
})

describe("POST /playlists/:id/add-track", () => {

    it("Adds track to playlist", async () => {
        let track = {
            title: "There Will Never Be Another You",
            artistId: mongoose.Types.ObjectId(),
            albumId: mongoose.Types.ObjectId(),
            duration: 374,
            url: "./there-will-never-be-another-you",
            tier: "Free",
            genre: "Jazz",
            description: "",
        }
        const trackId = await createTestTrack(track)

        const response = await request(app).post(`/playlists/${testingPlaylistsIds[0]}/add-track`)
            .send({trackId: trackId})

        const playlist = await Playlist.findById(testingPlaylistsIds[0])

        expect(response.status).toEqual(204)
        expect(playlist.tracks).toHaveLength(2)
    })
})

describe("POST /playlists/:id/remove-track", () => {

    it.skip("Removes track from playlist", async () => {
        const track = await Song.find()
        const trackId = track[0]._id

        const response = await request(app).post(`/playlists/${testingPlaylistsIds[0]}/remove-track`)
            .send({trackId: trackId})

        const playlist = await Playlist.findById(testingPlaylistsIds[0])

        expect(response.status).toEqual(204)
        expect(playlist.tracks).toHaveLength(0)
    })
})