const express = require("express");
const Blog = require("../models/blog");
const Comment = require("../models/comment");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/blogs", auth, async (req, res) => {
  const blog = new Blog({ ...req.body, owner: req.user._id });

  try {
    await blog.save();
    res.status(201).send(blog);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/blogs", (req, res) => {
  res.render("blogs");
});

router.get("/create_blog", (req, res) => {
  res.render("create_blog");
});

router.get("/edit_blog/:id", (req, res) => {
  res.render("edit_blog");
});

router.get("/blogs2", auth, async (req, res) => {
  try {
    await req.user.populate("blogs");
    res.send(req.user.blogs);
  } catch (e) {
    res.status(500).send();
    console.log(e);
  }
});

router.get("/blogs/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const blog = await Blog.findOne({ _id, owner: req.user._id });

    if (!blog) {
      return res.status(404).send();
    }

    res.send(blog);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/blogs_delete/:id", (req, res) => {
  res.render("blogs");
});

router.patch("/blogs/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "title", "comments"];
  const isValidOperation = updates.every((update) =>
    allowedUpdates.includes(update)
  );

  if (!isValidOperation) {
    return res.status(400).send({ error: "Invalid updates!" });
  }

  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!blog) {
      return res.status(404).send();
    }
    updates.forEach((update) => (blog[update] = req.body[update]));
    await blog.save();

    res.send(blog);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.delete("/blogs/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!blog) {
      res.status(404).send();
    }

    res.send(blog);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
