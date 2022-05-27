const express = require("express");
const Comment = require("../models/comment");
const Blog = require("../models/blog");
const router = new express.Router();
const auth = require("../middleware/auth");

router.get("/comments/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {
    const blog = await Blog.find({ _id, owner: req.user._id }).populate(
      "comments"
    );

    if (!blog) {
      return res.status(404).send();
    }

    res.send(blog);
  } catch (e) {
    res.status(500).send();
  }
});

router.get("/comment/:id", (req, res) => {
  res.render("comment");
});

router.patch("/comments/:id", auth, async (req, res) => {
  try {
    const blog = await Blog.findOne({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!blog) {
      return res.status(404).send();
    }
    const comment = new Comment({ ...req.body, blog: blog._id });
    blog["comments"].push(comment);
    await comment.save();
    await blog.save();

    res.send(blog);
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.delete("/comments/:id", async (req, res) => {
//   try {
//     const comment = await Comment.findOneAndDelete({
//       _id: req.params.id,
//       blog: req.blog._id,
//     });

//     if (!comment) {
//       res.status(404).send();
//     }
//     res.send(comment);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

module.exports = router;
