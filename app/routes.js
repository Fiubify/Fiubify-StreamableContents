const express = require('express')

const router = express.Router()

router.get('/', (req, res) => {
  // Traer pagina principal con listado de streamable contents
  res.send("foo")
})

router.get('/authors', (req, res) => {
  // Traer listado de artistas
  res.send("bar")
})

router.get('/albums', (req, res) => {
  // Traer listado de albums
  res.send("baz")
})

module.exports = router;