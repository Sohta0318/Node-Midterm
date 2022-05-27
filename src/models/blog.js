const mongoose = require("mongoose");
const Comment = require("./comment");

const blogSchema = new mongoose.Schema({
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
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Comment",
    },
  ],
});

blogSchema.pre("remove", async function (next) {
  const blog = this;
  await Comment.deleteMany({ owner: blog._id });

  next();
});

const Blog = mongoose.model("Blog", blogSchema);

module.exports = Blog;
