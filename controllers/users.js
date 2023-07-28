const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const User = require("../models/Users");
const Playlist = require("../models/Playlist");

router.post("/signup", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    console.log("This is the body data:", name, email, password);

    // check if there is data in the body
    if (!name || !email || !password) {
      return res.status(400).json({ message: "Please fill in all fields" });
    }
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" });
    }

    //hash the password
    const saltRounds = 15;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
    });
    console.log("this is the new user:", newUser);

    const token = jwt.sign({ newUser }, process.env.TOKEN_SECRET);
    res.json(token);
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

router.get("/login", async (req, res) => {
  const { email, password } = req.body;

  // check if there is data in the body
  if (!email || !password) {
    return res.status(400).json({ message: "Please fill in all fields" });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User does not exist" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: "Invalid password" });
    }

    const token = jwt.sign({ user }, process.env.TOKEN_SECRET);
    const decodedUser = jwt.decode(token);
    res.json(token, { user: decodedUser });
  } catch (err) {
    res.status(500).json(err);
  }
});

// update the user objects when a playlist is made
router.put("/addPlaylist/:id", async (req, res) => {
  try {
    const { userID } = req.params;
    const { name, songs } = req.body;

    // check if there is data in the body
    if (!id || !name || !songs) {
      res.status(400).json({ message: "Please fill in all fields" });
    }

    const newPlaylist = await Playlist.create({ name, songs });

    await User.findByIdAndUpdate(userID);

    res.status(200).json({
      message: "Playlist successfully created",
      newPlaylist,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// add a new favorite song to the array
router.put("/addFavoriteSong/:id", async (req, res) => {
  try {
    const { userID } = req.params;
    const { song } = req.body;

    if (!userID) {
      res.status(400).json({ message: "Please provide an id" });
    } else if (!song) {
      res
        .status(400)
        .json({ message: "I need a song to put in the database🤦🏾‍♂️" });
    }

    const user = await User.findByIdAndUpdate(
      userID,
      { $push: { favoriteSongs: song } },
      { new: true }
    );
  } catch (err) {
    console.err(err);
    res.status(500).json(err);
  }
});

module.exports = router;
