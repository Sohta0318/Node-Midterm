const mongoose = require("mongoose");

const commentSchema = mongoose.Schema({
  username: {
    type: String,
    trim: true,
  },
  comment: {
    type: String,
    trim: true,
  },
  blog: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
    ref: "Blog",
  },
});

const Comment = mongoose.model("Comment", commentSchema);

module.exports = Comment;
