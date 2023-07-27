const express = require("express");
const router = express.Router();
const getAccessToken = require("../spotify-api/spotify-api");

let access_token;

// ALBUM ROUTES, HANDLED BY IVANA

// search
router.get("/search", async (req, res) => {
  try {
    const { searchInput } = req.body;
    access_token = await getAccessToken();

    authParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

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
        };
        for (let i = 0; i <= 3; i++) {
          relaventResults.artists.push(data.artists.items[i].id);
          relaventResults.albums.push(data.albums.items[i].id);
          relaventResults.tracks.push(data.tracks.items[i].id);
        }
        return relaventResults;
      });

    console.log(access_token);
    res.json(items);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// categories

router.get("/categories", async (req, res) => {
  access_token = await getAccessToken();

  authParams = {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${access_token}`,
    },
  };

  let categories = await fetch(
    `https://api.spotify.com/v1/browse/categories/dinner`,
    authParams
  )
    .then((response) => response.json())
    .then((data) => {
      return data;
    });
  res.json(categories);
});

// get one artist
router.get("/artist/:id", async (req, res) => {
  try {
    access_token = await getAccessToken();

    authParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

    const { id } = req.params;
    console.log("Fetching data for one artist:", id);

    const response = await fetch(
      `https://api.spotify.com/v1/artists/${id}`,
      authParams
    );
    if (response.status === 200) {
      const data = await response.json();
      if (data) {
        const results = [
          {
            id: data.id,
            name: data.name,
            image: data.images[1]?.url, // Use optional chaining to handle missing images
            followers: data.followers.total,
            popularity: data.popularity,
          },
        ];
        res.json(results);
      } else {
        // Data is empty, indicating an invalid ID
        res.status(404).json({ error: "Artist not found" });
      }
    } else {
      // Non-200 status code received from Spotify API
      res.status(response.status).json({ error: "Error fetching artist data" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// get multiple artists
router.get("/multiple-artists/:ids", async (req, res) => {
  try {
    const ids = req.params.ids.split(",");
    access_token = await getAccessToken();

    authParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

    let artistResults = await fetch(
      `https://api.spotify.com/v1/artists/?ids=${ids}`,
      authParams
    )
      .then((response) => response.json())
      .then((data) => {
        let results = [];

        data.artists.forEach((artist) => {
          results.push({
            id: artist.id,
            name: artist.name,
            image: artist.images[1].url,
            followers: artist.followers.total,
            popularity: artist.popularity,
          });
        });
        return results;
      });
    res.json(artistResults);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// get one song/ multiple songs
router.get("/track/:id", async (req, res) => {
  try {
    access_token = await getAccessToken();
    let trackResults;
    authParams = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${access_token}`,
      },
    };

    if (req.params.id.length < 2) {
      const { id } = req.params;
      console.log(id);
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
          };

          results.name = data.name;
          results.artists = data.artists.name;
          results.album = data.album.name;
          results.popularity = data.popularity;
          results.imageURL = data.album.images[1].url;

          return results;
        });
    } else if (req.params.id.length > 2) {
      const ids = req.params.id.split(",");
      console.log(ids);
      let trackResults = await fetch(
        `https://api.spotify.com/v1/tracks/?ids=${ids}`,
        authParams
      )
        .then((response) => response.json())
        .then((data) => {
          let results = [];

          data.tracks.forEach((song) => {
            results.push({
              name: song.name,
              album: song.album.name,
              artists: song.artists.name,
              popularity: song.popularity,
              imageURL: song.album.images[1].url,
            });
          });
          return results;
        });
      res.json(trackResults);
    }

    res.json(trackResults);
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;
