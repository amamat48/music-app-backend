const express = require("express");
const router = express.Router();

const Post = require("../models/Posts");

// get all posts
router.get("/", async (req, res) => {
  const posts = await Post.find({});

  res.json(posts);
});

// delete a post
router.delete("/delete/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      await Post.findByIdAndDelete(id);
      res.json({
        status: 200,
        success: true,
        message: "Post deleted successfully",
      });
    } else {
      res.status(400).json({ message: "Please provide an id" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// update a post
router.put("/update/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      await Post.findByIdAndUpdate(id, req.body);
      res.json({
        status: 200,
        success: true,
        message: "Post updated successfully",
      });
    } else {
      res.status(400).json({ message: "Please provide an id" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

//create a new post
router.post("/create", async (req, res) => {
  const { title, content } = req.body;
  console.log("this is the body: ",title, content);
  try {
    if (title && content) {
      await Post.create({ title, content });
      res.json({
        status: 200,
        success: true,
        message: "Post created successfully",
      });
    } else {
      res.status(400).json({ message: "Please fill in all fields" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// get a post by id
router.get("/:id", async (req, res) => {
  const id = req.params.id;
  try {
    if (id) {
      const post = await Post.findById(id);
      res.json(post);
    } else {
      res.status(400).json({ message: "Please provide an id" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;
