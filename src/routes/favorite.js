const express = require("express");
const Favorite = require("../models/favorite");
const router = new express.Router();
const auth = require("../middleware/auth");

router.post("/favorites", auth, async (req, res) => {
  const favorite = new Favorite({ ...req.body, owner: req.user._id });

  try {
    await favorite.save();
    res.status(201).send(favorite);
  } catch (e) {
    res.status(400).send(e);
  }
});

router.get("/favorites", (req, res) => {
  res.render("favorites");
});

router.get("/favorite/:id", (req, res) => {
  res.render("/favorites");
});

router.get("/favorites2", auth, async (req, res) => {
  try {
    await req.user.populate("favorites");
    res.send(req.user.favorites);
  } catch (e) {
    res.status(500).send();
    console.log(e);
  }
});

router.delete("/favorites/:id", auth, async (req, res) => {
  try {
    const favorite = await Favorite.findOneAndDelete({
      _id: req.params.id,
      owner: req.user._id,
    });

    if (!favorite) {
      res.status(404).send();
    }
    res.send(favorite);
  } catch (e) {
    res.status(500).send();
  }
});

module.exports = router;
