const express = require("express");
require("./db/mongoose");
const userRouter = require("./routes/user");
const blogRouter = require("./routes/blog");
const favoriteRouter = require("./routes/favorite");
// const bodyParser = require('body-parser');
const path = require("path");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));
app.use(express.static(__dirname + "/public"));
// app.use(bodyParser.urlencoded({ extended: false }))
app.use(userRouter);
app.use(blogRouter);
app.use(favoriteRouter);

app.listen(port, () => {
  console.log("Server is up on" + port);
});
