const mongoose = require("mongoose");

const Blog = mongoose.model("blogs", {
  title:{
 type: String,
 required: true,
 trim: true,
  },
  description: {
    type: String,
    required: true,
    trim: true,
  },
});

module.exports = Blog;
