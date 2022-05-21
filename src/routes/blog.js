const express = require("express");
const Blog = require("../models/blog");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/create_blog", auth, async (req, res) => {
  const blog = new Blog({ ...req.body, owner: req.user._id });

  try {
    await blog.save();
    res.status(201).send(blog);
    res.redirect('/blogs')
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/blogs", auth, async (req, res) => {
  try {
    await req.user.populate("products");
    res.send(req.user.products);
    res.render('blogs')
  } catch (e) {
    res.status(500).send();
    console.log(e);
  }
});

router.get("/blog/edit/:id", auth, async (req, res) => {
  const _id = req.params.id;

  try {

    const blog = await Blog.findOne({ _id, owner: req.user._id });

    if (!blog) {
      return res.status(404).send();
    }

    res.send(blog);
    res.render('edit_blog')
  } catch (e) {
    res.status(500).send();
  }
});

router.patch("/blog/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowedUpdates = ["description", "title"];
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
    // const blog = await blog.findById(req.params.id);

    if (!blog) {
      return res.status(404).send();
    }
    updates.forEach((update) => (blog[update] = req.body[update]));
    await blog.save();

    res.send(blog);
    res.redirect('/blogs')
  } catch (e) {
    res.status(400).send(e);
  }
});

// router.delete("/blog", auth, async (req, res) => {
//   try {
//     // const product = await product.findByIdAndDelete(req.params.id);
//     const blog = await Blog.deleteMany();

//     if (!blog) {
//       res.status(404).send();
//     }

//     res.send(blog);
//   } catch (e) {
//     res.status(500).send();
//   }
// });

router.delete("/blog/:id", auth, async (req, res) => {
  try {
    // const product = await product.findByIdAndDelete(req.params.id);
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
