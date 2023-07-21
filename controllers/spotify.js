const express = require("express")
const axios = require("axios")
const router = express.Router()
const getAccessToken = require("../spotify-api/spotify-api")

let access_token

// search
router.get("/search", async (req, res) => {
  const { searchInput } = req.body
  access_token = await getAccessToken()

  authParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  }

items = await fetch(
    `https://api.spotify.com/v1/search?q=${searchInput}&type=artist,album,track`,
    authParams
  )
    .then((response) => response.json())
    .then((data) => {
      let relaventResults = {
        artists: [],
        albums: [],
        tracks: [],
      }
      for (let i = 0; i <= 3; i++) {
        relaventResults.artists.push(data.artists.items[i].id)
        relaventResults.albums.push(data.albums.items[i].id)
        relaventResults.tracks.push(data.tracks.items[i].id)
      }
      return relaventResults
    })

  console.log(access_token)
  res.json(items)
})

// categories

router.get("/categories", async (req, res) => {
  access_token = await getAccessToken()

  authParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer ${access_token}`,
    },
  }
  let categories = await fetch(
    `https://api.spotify.com/v1/browse/categories/dinner`,
    authParams
  )
    .then((response) => response.json())
    .then((data) => {
      return data
    })
  res.json(categories)
})


// get one song
router.get("/track/:id", async (req, res) => {
  access_token = await getAccessToken()
  let trackResults
  authParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  }

  if (req.params.id.length < 2) {
    const { id } = req.params
    console.log(id)
    trackResults = await fetch(
      `https://api.spotify.com/v1/tracks/${id}`,
      authParams
    )
      .then((response) => response.json())
      .then((data) => {
        let results = {
          name: "",
          album: "",
          artists: "",
          popularity: 0,
          imageURL: "",
        }

        results.name = data.name
        results.artists = data.artists.name
        results.album = data.album.name
        results.popularity = data.popularity
        results.imageURL = data.album.images[1].url

        return results
      })
  } else if (req.params.id.length > 2) {
    const ids = req.params.id.split(",")
    console.log(ids)
    let trackResults = await fetch(
      `https://api.spotify.com/v1/tracks/?ids=${ids}`,
      authParams
    )
      .then((response) => response.json())
      .then((data) => {
        let results = []

        data.tracks.forEach((song) => {
          results.push({
            name: song.name,
            album: song.album.name,
            artists: song.artists.name,
            popularity: song.popularity,
            imageURL: song.album.images[1].url,
          })
        })
        return results
      })
    res.json(trackResults)
  }

  res.json(trackResults)
})

module.exports = router
