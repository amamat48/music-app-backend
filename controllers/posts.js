const express = require("express");
const router = express.Router();

const Post = require("../models/Posts");
const Comment = require("../models/Comments");

// get all posts and comments
router.get("/", async (req, res) => {
  const posts = await Post.find({}).populate("Comments");

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

// update post with a new like
router.put("/addlikes/:id", async (req, res) => {
  try {
    const id = req.params.id;
    if (id) {
      await Post.findByIdAndUpdate(id, { $inc: { likes: 1 } });
      res.json({
        status: 200,
        success: true,
        message: "Post liked successfully",
      });
    } else {
      res.status(400).json({ message: "Please provide an id" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});
// update post with a new comment
router.put("/addcomment/:id", async (req, res) => {
  try {
    const postId = req.params.id;
    const { comment } = req.body;
    console.log("this is the comment data: ", comment);
    if (postId) {
      const createdComment = await Comment.create({ comment: comment });
      console.log("this is the comment: ", createdComment);
      await Post.findByIdAndUpdate(
        postId,
        { $push: { Comments: createdComment._id } },
        { new: true }
      );
      res.json({
        status: 200,
        success: true,
        message: "Comment created successfully",
      });
    } else {
      res.status(400).json({ message: "Please provide an id" });
    }
  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

//create a new post
router.post("/create", async (req, res) => {
  try {
    const { title, content } = req.body;
    console.log("this is the body: ", title, content);
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

// edit the post itself
router.put("/edit/:id", async (req, res) => {
  try {
    const id = req.params.id;
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

// get a post by id, show route
router.get("/:id", async (req, res) => {
  try {
    const id = req.params.id;
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
