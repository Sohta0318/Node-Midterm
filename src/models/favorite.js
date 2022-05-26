const mongoose = require("mongoose");

const favoriteSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "User",
  },
});

const Favorite = mongoose.model("Favorite", favoriteSchema);

module.exports = Favorite;
