const express = require("express");
const Blog = require("../models/blog");
const { route } = require("./user");
const router = new express.Router();

router.post("/create_blog", async (req, res) => {
  const blog = new Blog(req.body);

  try {
    await blog.save();
    res.status(201).send(blog);
    res.redirect('/blogs')
  } catch (error) {
    res.status(400).send(e);
  }
});

router.get("/blogs", async (req, res) => {
  res.render('blogs')
  try {
    const blog = await Blog.find({});
    res.send(blog);
  } catch (error) {
    res.status(500).send();
  }
});

router.get("/blog/edit/:id", async (req, res) => {
  res.render('edit_blog')
  const _id = req.params.id;

  try {
    const blog = Blog.findById(_id);
    if (!blog) {
      return res.status(404).send();
    }
    res.send(blog);
  } catch (error) {
    res.status(400).send();
  }
});

router.patch("/blog/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "completed"];
  const isValidOperation = updates.every((update) => {
    return allowedUpdates.includes(update);
  });
  if (!isValidOperation) {
    res.status(400).send({ error: "Invalid Updates!" });
  }
  try {
    const blog = await Blog.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidator: true,
    });
    if (!blog) {
      return res.status(404).send();
    }
    res.send(blog);
    res.redirect('/blogs')
  } catch (error) {
    res.status(400).send(error);
  }
});

router.delete("/blog/:id", async (req, res) => {
  try {
    const blog = await Blog.findByIdAndDelete(req.params.id);
    if (!blog) {
      return res.status(404).send();
    }
    res.send(blog);
    res.redirect('/blogs')
  } catch (error) {
    res.status(500).send();
  }
});

module.exports = router;
